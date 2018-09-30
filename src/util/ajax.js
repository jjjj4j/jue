import {each} from '@/util/array'
import {isArray, isFunction} from '@/util/core'

export function chain (...args) {
  let list = []
  let sync = []
  
  each(args, (event) => {
    if (isArray(event)) {
      let next = function (rst) {
        if (event.length > 0) {
          (event.shift())(rst).then(next)
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
    return each(sync, (event) => event(rst)), rst
  }).catch((error) => {
    throw error
  })
}
