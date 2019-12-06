import { each } from './array'
import { isArray, isFunction } from './core'

export function chain (...args) {
  let list = []
  let sync = []

  each(args, (event) => {
    if (isArray(event)) {
      let next = function (rst) {
        if (event.length > 0) {
          return (event.shift())(rst).then(next.bind(this)).catch((e) => { this[1](e) })
        } else {
          this[0](rst)
        }
      }
      sync.push(next)
    } else if (isFunction(event)) {
      list.push(event())
    } else {
      list.push(event)
    }
  })

  return Promise.all(list).then((rst) => {
    if (sync.length > 0) {
      return new Promise((resolve, reject) => {
        sync[0].call([resolve, reject], rst)
      })
    }
    return rst
  })
}
