import StringBuffer from './StringBuffer'

const win = window
const UNDEFINED = 'undefined'
const BOOLEAN = 'boolean'
const FUNCTION = 'function'
const STRING = 'string'

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
  let Range = isDefined(max) ? (max - Min) : (parseInt(new StringBuffer([1, repeat(0, length)]).val(), type) - Min - 1)
  return (Min + Math.round(Math.random() * Range)).toString(type)
}

/**
 * 使用指定字符，扩展字符串的长度
 * @value 需要修改的字符串
 * @length 字符串最终长度
 * @prefix 补位字符
 * @index 补位字符的添加位置， 0 代表开头，1 代表结尾
 * */
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

export function noop () {}
