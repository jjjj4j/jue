import { parseInt, extend, isArray, isChar, isDefined, random16 } from '@/util/core'
import { map } from '@/util/array'
import { db } from './data'

export default {
  fr (data) {
    data = data || {}
    data.message = '成功'
    return {
      code: 200,
      data: data
    }
  },
  fa (code) {
    return {
      code: code || 400,
      data: {
        message: '错误'
      }
    }
  },
  first (modal) {
    if (db[modal] && db[modal].length > 0) {
      return db[modal][0]
    }
  },
  getById (modal, id) {
    return this.getByAttr(modal, [['id', id]])
  },
  getByAttr (modal, attrs, filter) {
    let list = this.getAllByAttr(modal, attrs, filter)
    if (list.length > 0) {
      return list[0]
    }
  },
  getAllByAttr (modal, attrs, filter) {
    let data = db[modal]
    let list = []
    /* eslint-disable no-labels */
    iterator: for (let index in data) {
      let obj = data[index]
      if (attrs) {
        for (let i = 0; i < attrs.length; i++) {
          let key = attrs[i][0], value = attrs[i][1]
          if (obj[key] !== value) {
            continue iterator
          }
        }
      }
      if (filter && !filter.call(obj)) {
        continue iterator
      }
      list.push(extend(true, {}, obj))
    }
    return list
  },
  page (modal, args, attrs) {
    let data = db[modal]
    let list = []
    let filter = function (obj) {
      if (args.search) {
        if (isDefined(args.searchType)) {
          if (obj.searchType !== args.searchType) {
            return false
          }
        }
        for (let attrName in obj) {
          let attr = obj[attrName]
          if (typeof attr === 'string' && attr.indexOf(args.search) >= 0) {
            return true
          }
        }
        return false
      }
      return true
    }
  
    iterator : for (let index in data) {
      let obj = data[index]
      if (filter(obj)) {
        if (attrs) {
          for (let i = 0; i < attrs.length; i++) {
            let key = attrs[i][0], value = attrs[i][1]
            if (isArray(value)) {
              let flag = true
              value.forEach(function (v) {
                if (obj[key] === v) {
                  return (flag = false)
                }
              })
              if (flag) {
                continue iterator
              }
            } else if (obj[key] !== value) {
              continue iterator
            }
          }
        }
        list.push(extend(true, {}, obj))
      }
    }

    let currentPage = parseInt(args.currentPage)
    let pageSize = parseInt(args.pageSize)
    let start = ((currentPage || 1) - 1) * (pageSize || 10)
    let end = start + (pageSize || 10)
    
    return this.fr({
      currentPage: currentPage || 1,
      totalSize: list.length,
      pageSize: pageSize || 10,
      list: list.slice(start, end)
    })
  },
  get (modal, id) {
    return this.fr({
      object: this.getById(modal, id)
    })
  },
  save (modal, obj) {
    let data = db[modal], old
    let rst = {}
    
    if (obj.id) {
      for (let i = 0; i < data.length; i++) {
        if (data[i].id === obj.id) {
          old = data[i]
          break
        }
      }
      if (old) {
        extend(old, obj)
      } else {
        data.push(extend(true, {}, obj))
      }
    } else {
      rst.id = obj.id = random16(8)
      data.push(extend(true, {}, obj))
    }

    return this.fr(rst)
  },
  del (modal, ids) {
    let data = db[modal]
    let i = data.length - 1
    
    if (isChar(ids)) {
      ids = [ids]
    }

    for (; i >= 0; i--) {
      if (ids.indexOf(data[i].id) >= 0) {
        data.splice(i, 1)
      }
    }
  
    return this.fr()
  },
  delByAttr (modal, attrs) {
    this.del(modal, map(this.getAllByAttr(modal, attrs), (obj) => {
      return obj.id
    }))
    return this.fr()
  }
}
