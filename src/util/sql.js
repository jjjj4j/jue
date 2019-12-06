import { isArray, isChar, noop, fire, isDefined } from '@/util/core'
import { each, map } from '@/util/array'
import { l2b } from '@/util/json'
import { chain } from '@/util/ajax'
import StringBuffer from '@/util/StringBuffer'

const TABLES = {}
export const DB = openDatabase('PVM', '1.0', 'Tree Cache', 50 * 1024 * 1024)

export function transaction (event, success = noop, error = noop) {
  DB.transaction(event, error, success)
}

export class Table {
  constructor (name, columns) {
    let create = StringBuffer(`CREATE TABLE IF NOT EXISTS ${name} `)
    let insert = StringBuffer(`INSERT INTO ${name} `)
  
    create.concat('(', map(columns, (type, name) => name + ' ' + type).join(','), ')')
    insert.concat('(', map(columns, (type, name) => name).join(','), ') VALUES ')
  
    this.name = name
    this.columns = columns
  
    this.CREATE_SQL = create.val()
    this.INSERT_SQL = insert.val()
  
    TABLES[name] = this
  }
  
  create (context, success = noop, error = noop) {
    return context.executeSql(this.CREATE_SQL, [], success.bind(this), error.bind(this)), this
  }
  
  insert (context, list, success = noop, error = noop) {
    if (isArray(list)) {
      let sql = this.INSERT_SQL
      let values = StringBuffer(0, ',')
    
      each(list, (item) => {
        let value = StringBuffer(0, ',')
        each(this.columns, (type, name) => {
          value.push(isChar(name) ? "'" + item[name] + "'" : item[name])
        })
        values.push('(' + value.val() + ')')
      })

      context.executeSql(sql + values.val(), [], success.bind(this), error.bind(this))
    } else {
      this.insert(context, [list], success, error)
    }
  }
  
  query (context, filter, success = noop, error = noop) {
    if (filter) {
      const where = new StringBuffer(0, 'AND')
      each(filter, (value, key) => {
        where.push(`${key}=${isChar(value) ? "'" + value + "'" : value}`)
      })
      context.executeSql(`SELECT * FROM ${this.name} WHERE ` + where.val(), [], success.bind(this), error.bind(this))
    } else {
      context.executeSql(`SELECT * FROM ${this.name}`, [], success.bind(this), error.bind(this))
    }
  }
  
  remove (context, success = noop, error = noop) {
    context.executeSql(`DELETE FROM ${this.name}`, [], success.bind(this), error.bind(this))
  }
  
  drop (context, success = noop, error = noop) {
    context.executeSql(`DROP TABLE ${this.name}`, [], () => { delete TABLES[this.name]; success.bind(this) }, error.bind(this))
  }
  
  static find (name, columns) {
    return TABLES[name] || new Table(name, columns)
  }
  
  static drop (context, name, columns, success = noop, error = noop) {
    Table.find(name, columns).drop(
      context,
      (context, rst) => {
        fire.call(this, success, rst)
      },
      error.bind(this)
    )
  }
}

export class TreeCache {
  constructor (context, columns, success = noop, error = noop) {
    this.step = 100000
    this.columns = columns
    this.cacheTable = new Table('TREE_TABLE', { name: 'TEXT UNIQUE' }).create(context, success, error)
  }
  
  drop (context) {
    let query = () => new Promise((resolve, reject) => {
      this.cacheTable.query(context, 0, (context, rst) => resolve(rst), (context, rst) => reject(rst))
    })
    let remove = () => new Promise((resolve, reject) => {
      this.cacheTable.remove(context, (context, rst) => resolve(rst), (context, rst) => reject(rst))
    })
    let drop = (index, name) => () => new Promise((resolve, reject) => {
      Table.drop(
        context,
        name,
        this.columns,
        (context, rst) => resolve(rst),
        (context, rst) => reject(rst)
      )
    })
    let list = (rst) => new Promise((resolve) => {
      let index = 0, length = rst.rows.length
      if (length > 0) {
        for (; index < length; index++) {
          event.push(drop(index, rst.rows.item(index).name))
        }
        event.push(remove)
      }
      resolve(rst)
    })
    let event = [query, list]

    return chain(event)
  }
  
  insert (context, list) {
    let name, event = []
    
    const { step, columns, cacheTable } = this
    const id = l2b(columns).value
    const TS = {}
    
    each(list, (item) => {
      name = `T${parseInt(item[id] / step)}`
      TS[name] = TS[name] || []
      TS[name].push(item)
    })
  
    each(TS, (list, name) => {
      event.push(() => new Promise((resolve, reject) => {
        cacheTable.query(context, { name }, (context, rst) => resolve(rst), (context, rst) => reject(rst))
      }))
      event.push((rst) => new Promise((resolve, reject) => {
        if (rst.rows.length === 0) {
          cacheTable.insert(context, { name }, (context, rst) => resolve(rst), (context, rst) => reject(rst))
        } else {
          resolve(rst)
        }
      }))
  
      event.push(() => new Promise((resolve, reject) => {
        new Table(name, this.columns).create(context, function () { resolve(this) }, (context, rst) => reject(rst))
      }))
  
      event.push((rst) => new Promise((resolve, reject) => {
        rst.insert(context, list, (context, rst) => resolve(rst), (context, rst) => reject(rst))
      }))
    })
  
    return chain(event)
  }
  
  query (context, ids, success, error) {
    if (isArray(ids)) {
      let event = []
      let list = []
      let push = (rst) => {
        if (isDefined(rst) && !isArray(rst)) {
          let index = 0, length = rst.rows.length
          if (length > 0) {
            for (; index < length; index++) {
              list.push(rst.rows.item(index))
            }
          }
        }
      }
      each(ids, (id) => {
        event.push(() => {
          let name = `T${parseInt(id / this.step)}`
          let table = Table.find(name, this.columns)
          
          return new Promise((resolve, reject) => {
            table.query(context, { id }, (context, rst) => (push(rst), resolve(rst)), (context, rst) => reject(rst))
          })
        })
      })
      
      return chain(event).then(success(list)).catch(error)
    } else {
      this.query(context, [ids], success, error)
    }
  }
}
