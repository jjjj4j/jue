import {each} from '@/util/array'

const cache = {}, win = window

const create = function (fn, step, handle) {
  return win['set' + handle](fn, step)
}
const destroy = function (timer, handle) {
  win['clear' + handle](timer)
}

export default class {
  constructor (np, fn, step = 1000, interval) {
    this.namespace = np
    this.handle = interval ? 'Interval' : 'Timeout'
    this.timer = create(fn, step, this.handle)

    cache[np] && cache[np].stop()
    cache[np] = this
  }

  stop () {
    delete cache[this.namespace]
    destroy(this.timer, this.handle)
  }

  static destroy (list = cache) {
    each(list, (timer) => timer.stop())
  }
}
