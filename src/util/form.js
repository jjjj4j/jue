import Prefix from '@/service/prefix'
import { each, map } from '@/util/array'
import { l2b } from '@/util/json'
import {
  parseFloat,
  parseInt,
  extend,
  fire,
  isArray,
  isDefined, isEmpty,
  isFunction,
  isPlainObject, isUndefined, isBoolean
} from '@/util/core'

const tagFormat = {
  'el-select': 'el-option',
  'el-checkbox-group': 'el-checkbox',
  'el-radio-group': 'el-radio'
}

export function initForm (setting) {
  let ajax = setting.ajax || {}
  let model = setting.model || []
  let events = setting.events || []
  let method = isDefined(model.id) ? 'put' : 'post'

  let createAjax = (ajax) => {
    let data = ajax
    let list = []
    let getParam = (list) => {
      return list.find(function (item) {
        return item !== 'put' && !(isFunction(item)) && !(item instanceof Prefix)
      })
    }
    let getPrefix = (list) => {
      return list.find((item) => item instanceof Prefix)
    }
    let getMethod = (list) => {
      return list.find((item) => item === 'post' || item === 'put')
    }
    
    each(data, (ajax) => {
      ajax = fire(ajax)
      if (isArray(ajax)) {
        if (getMethod(ajax) === 'put') {
          if (isDefined(model.id)) {
            list.push(ajax[0](getParam(ajax), getPrefix(ajax)))
          }
        } else {
          list.push(ajax[0](getParam(ajax), getPrefix(ajax)))
        }
      } else {
        list.push(ajax)
      }
    })
    
    return Promise.all(list)
  }
  
  createAjax(ajax).then((rst) => {
    each(events, (event) => {
      if (fire(event) === event) {
        if (event.method === method) {
          event.fn.call(model, rst)
        }
      }
    })
  })
}

export function isRoot (id) {
  let rootId = '00000000-0000-0000-0000-000000000000'
  if (isPlainObject(id)) {
    id = id.id
  }
  return id === rootId || isEmpty(id)
}

export function copyValue (obj, tpl, attr) {
  if (attr) {
    if (isArray(attr)) {
      each(attr, (field) => {
        copyValue(obj, tpl, field.name)
      })
    } else {
      obj[attr] = isDefined(tpl[attr]) ? tpl[attr] : ''
    }
  }
  return obj
}

export function increment (value) {
  if (isDefined(value)) {
    let num = parseInt('1' + value.split('').reverse().join(''))
    if (num !== 1) {
      let str = value.split('').reverse()
      str.splice(0, (num + '').length - 1)
      num = num + '1'
      num = (parseInt(num.split('').reverse().join('')) + 9) / 10 + ''
      num = (() => {
        let array = num.split('').reverse()
        if (array[array.length - 1] === '1') {
          return array.slice(0, num.length - 1)
        } else {
          array[array.length - 1] = '1'
          return array
        }
      })()
      value = str.reverse().join('') + num.reverse().join('')
    } else {
      value = ''
    }
  }
  return value
}

/**
 * 格式化fields数据
 *
 * @param fields {Array} 实体对应的字段定义
 * {
 *    name: '{String}', list 对象中 name 属性名
 *    value: '{String}', list 对象中 value 属性名
 *    type: '{String | Number}', field 的 数据类型
 *    default: '{*}', 默认值
 *    emptyOption: '{Boolean | Function}' 是否存在空选项
 *    list: '{Array}'
 * }
 * @param final {Object} 常量数据
 * @param prop {Object} 一般为ajax加载的select数据
 *
 * */
export function formatFinal (fields, final, prop) {
  return each(fields, (field) => {
    let { tag, name, children, emptyOption } = field
    let list, setting
    let isSelect = tag === 'el-select'
    
    tag = tagFormat[field.tag]
    
    if (children) {
      formatFinal(children, final, prop)
    }
  
    // 判断是否为表单属性而不是普通标签
    // 依据为field中是否存在name属性
    if (!name) {
      return true
    }

    if ((setting = final && final[name])) {
      list = map(setting.list, (item) => l2b(item, 'name'))
    } else if ((setting = prop && prop[name])) {
      list = setting.list
    }
    
    if (setting) {
      let { name, value, type } = setting
      
      name = name || 'name'
      value = value || 'value'

      emptyOption = fire.call(field, emptyOption, name, value)
      if (isDefined(emptyOption)) {
        if (isBoolean(emptyOption)) {
          list = [{
            [ name ]: '无',
            [ value ]: ''
          }].concat(list)
        } else if (isPlainObject(emptyOption)) {
          list = [emptyOption].concat(list)
        }
      }
      
      if (isSelect) {
        field.data = extend(true, field.data, {
          props: {
            options: map(list, (item) => {
              return {
                label: item[name],
                value: Number === type ? parseFloat(item[value]) : item[value]
              }
            })
          }
        })
      } else {
        field.children = map(list, (item) => {
          return {
            tag: tag,
            data: {
              props: {
                name,
                label: item[value]
              }
            },
            children: [item[name]]
          }
        })
      }

      if (isUndefined(field.default)) {
        field.default = setting.default
      }
      if (isUndefined(field.default)) {
        if (list.length > 0) {
          field.default = list[0][isSelect ? value : name]
        } else {
          field.default = ''
        }
      }
    }
  })
}

export function modelTpl (fields, tpl) {
  if (isPlainObject(tpl)) {
    tpl = extend(true, {}, tpl)
  } else {
    tpl = {}
  }
  each(fields, (field) => {
    let name = field.name
  
    // 判断是否为表单属性而不是普通标签
    // 依据为field中是否存在name属性
    if (name) {
      if (isUndefined(tpl[name])) {
        tpl[name] = isDefined(field.default) ? field.default : ''
      }
    }
  })
  return tpl
}
