import { each } from './array'
import { fire } from './core'

const cache = {}, win = window

const create = function (fn, step, handle) {
  return win['set' + handle](fn, step)
}
const destroy = function (timer, handle) {
  return win['clear' + handle](timer)
}

class Timer {
  constructor (np, fn, step, interval) {
    this.namespace = np
    this.handle = interval ? 'Interval' : 'Timeout'
    this.timer = create(fn, step, this.handle)
  }
  
  destroy () {
    delete cache[this.namespace]
    return destroy(this.timer, this.handle)
  }
}

TimerFactory.destroy = function (list = cache) {
  each(list, (timer) => timer.destroy())
}

export default function TimerFactory (np, fn, step = 1000, immediately = !1, interval) {
  let timer = cache[np]
  if (timer) {
    timer.destroy()
  } else if (immediately) {
    fire(fn)
  }
  return (cache[np] = new Timer(np, fn, step, interval))
}
