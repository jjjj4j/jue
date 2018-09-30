import {isArray, isChar} from './core'

export default class {
  constructor (value, separator = '') {
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
