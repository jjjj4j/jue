import { isEmpty, isChar, isPlainObject } from './core'
import { each } from './array'

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
  if (isPlainObject(json)) {
    for (let k in json) {
      return {
        [key]: json[k],
        [value]: k
      }
    }
  }
}

export function b2l (json, key = 'id', value = 'value') {
  if (isPlainObject(json)) {
    return {
      [json[key]]: json[value]
    }
  }
}
