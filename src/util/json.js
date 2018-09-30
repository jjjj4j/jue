import {isEmpty, isChar, isPlainObject} from '@/util/core'
import {each} from '@/util/array'

export function json2str (json) {
  return JSON.stringify(json)
}

export function str2json (str) {
  return (isChar(str) && !isEmpty(str)) ? JSON.parse(str) : str
}

export function len4json (json) {
  let len = 0
  each(json, () => {
    len++
  })
  return len
}

export function l2b (json, key = 'id', value = 'value') {
  let ret = {}
  if (isPlainObject(json)) {
    each(json, (v, k) => {
      ret[key] = k
      ret[value] = v
    })
  }
  return ret
}

export function b2l (json, key = 'id', value = 'value') {
  let ret = {}
  if (isPlainObject(json)) {
    ret[json[key]] = json[value]
  }
  return ret
}
