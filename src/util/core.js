import StringBuffer from './StringBuffer'

const win = window
const UNDEFINED = 'undefined'
const BOOLEAN = 'boolean'
const FUNCTION = 'function'
const STRING = 'string'
const NUMBER = 'number'

function type (value, type) {
  let type4value = typeof value
  if (type) {
    return type4value === type
  }
  return type4value
}

export function parseInt (value, radix) {
  return win.parseInt(value, radix)
}

export function parseFloat (value) {
  return win.parseFloat(value)
}

export function parseChar (value) {
  try {
    return (value).toString()
  } catch (e) {
    return ''
  }
}

export function isEmpty (value) {
  return isUndefined(value) || isNull(value) || value === ''
}

export function isDefined (value) {
  return !isUndefined(value)
}

export function isUndefined (value) {
  return type(value, UNDEFINED)
}

export function isNull (value) {
  return value === null
}

export function isBoolean (value) {
  return type(value, BOOLEAN)
}

export function isFunction (value) {
  return type(value, FUNCTION)
}

export function isChar (value) {
  return type(value, STRING)
}

export function isNumber (value) {
  return type(value, NUMBER)
}

export function isArray (value) {
  return Array.isArray(value)
}

const class2type = {}
const toString = class2type.toString
const hasOwn = class2type.hasOwnProperty
const fnToString = hasOwn.toString
const ObjectFunctionString = fnToString.call(Object)

export function isPlainObject (obj) {
  let proto, Ctor
  if (!obj || toString.call(obj) !== '[object Object]') {
    return false
  }
  proto = Object.getPrototypeOf(obj)
  if (!proto) {
    return true
  }
  Ctor = hasOwn.call(proto, 'constructor') && proto.constructor
  return typeof Ctor === 'function' && fnToString.call(Ctor) === ObjectFunctionString
}

export function repeat (value, length) {
  return parseChar(value).repeat(length)
}

function random (type, length, min, max) {
  let Min = min || 0
  let Range = isDefined(max) ? (max - Min) : (parseInt(StringBuffer([1, repeat(0, length)]).val(), type) - Min - 1)
  return (Min + Math.round(Math.random() * Range)).toString(type)
}
/**
 * @description 使用指定字符，扩展字符串的长度
 * @param value 需要修改的字符串
 * @param length 字符串最终长度
 * @param prefix 补位字符
 * @param index 补位字符的添加位置， 0 代表开头，1 代表结尾
 * @returns {string}
 */
function str2len (value, length, prefix = 0, index = 0) {
  let diff = length - value.length
  let list = [value]

  if (diff > 0) {
    return list.splice(index, 0, repeat(prefix, diff)), list.join('')
  } else {
    return value.slice(0, length)
  }
}

export function random10 (length, min, max) {
  return str2len(random(10, length, min, max), length)
}

export function random16 (length, min, max) {
  return str2len(random(16, length, min, max), length)
}

export function roll (max = 100, type = 10) {
  return random(type, 0, 0, max)
}

const AUTO_ID_CACHE = {}
/**
 * @description 自增长ID 辅助函数
 * @param namespace ID命名空间
 * @returns {number}
 */
const AUTO_INCREMENT = function (namespace) {
  if (!AUTO_ID_CACHE[namespace]) {
    AUTO_ID_CACHE[namespace] = 0
  }
  return AUTO_ID_CACHE[namespace]++
}
/**
 * @description 自增长ID
 * @param namespace ID命名空间
 * @returns {string}
 */
export function AutoIncrementID (namespace) {
  return [
    namespace,
    AUTO_INCREMENT(namespace)
  ].join('-')
}

export function noop () {}

export function fire (fn, ...args) {
  if (fn) {
    return fn.apply(this, args)
  }
}

let rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g
export function trim (text) {
  return isEmpty(text) ? '' : parseChar(text).replace(rtrim, '')
}

export function extend (...args) {
  let options, name, src, copy, copyIsArray, clone
  let target = args[0] || {}
  let i = 1
  let length = args.length
  let deep = false
  
  if (isBoolean(target)) {
    deep = target
    target = args[i] || {}
    i++
  }

  if (typeof target !== 'object' && !isFunction(target)) {
    target = {}
  }

  if (i === length) {
    target = this
    i--
  }
  
  for (; i < length; i++) {
    if ((options = args[i]) != null) {
      for (name in options) {
        src = target[name]
        copy = options[name]
        
        if (target === copy) {
          continue
        }

        if (deep && copy && (isPlainObject(copy) || (copyIsArray = isArray(copy)))) {
          if (copyIsArray) {
            copyIsArray = false
            clone = src && isArray(src) ? src : []
          } else {
            clone = src && isPlainObject(src) ? src : {}
          }

          target[name] = extend(deep, clone, copy)
        } else if (copy !== undefined) {
          target[name] = copy
        }
      }
    }
  }

  return target
}
