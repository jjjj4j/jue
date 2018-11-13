import { each } from './array'
import { fire, isChar } from './core'

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
    this.step = step
    this.handle = interval ? 'Interval' : 'Timeout'
    this.timer = create(fn, step, this.handle)
    this.timestamp = Number(new Date())
  }
  
  destroy () {
    delete cache[this.namespace]
    return destroy(this.timer, this.handle)
  }
}

TimerFactory.destroy = function (list = cache) {
  each(list, (timer) => {
    if (isChar(timer)) {
      timer = cache[timer]
    }
    if (timer) {
      timer.destroy()
    }
  })
}

export default function TimerFactory (np, fn, step = 1000, immediately = !1, interval) {
  let timer = cache[np]
  let delay = step
  if (timer) {
    delay = timer.step - Number(new Date()) + timer.timestamp
    if (delay < 0) {
      delay = step
    }
    timer.destroy()
  } else if (immediately) {
    fire(fn)
  }
  return (cache[np] = new Timer(np, fn, delay, interval))
}
