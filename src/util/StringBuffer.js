import { isArray, isChar } from './core'

class StringBuffer {
  constructor (value, separator) {
    this.cache = []
    this.separator = separator

    if (isArray(value)) {
      this.cache = value
    } else if (isChar(value)) {
      this.cache = [value]
    }
  }

  push (value) {
    return this.cache.push(value), this
  }

  concat (value) {
    return this.cache.concat(value), this
  }

  val () {
    return this.cache.join(this.separator)
  }
}

export default function (value, separator = '') {
  return new StringBuffer(value, separator)
}
