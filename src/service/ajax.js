import { each } from '@/util/array'
import { URL } from './data'

import './entity/user'
import './entity/camera'
import './entity/group'
import './entity/org'
import './entity/encoder'

let ajax = function (method, url, data, success, error) {
  url = method ? method + '|' + url : url
  data = data || {}

  if (url.indexOf('?') > 0) {
    let list = url.split('?')
    url = list[0]
    each(list[1].split('&'), function (obj) {
      let dataArray = obj.split('=')
      data[dataArray[0]] = dataArray[1]
    })
  }

  let callback

  for (let key in URL) {
    let reg = new RegExp(key)
    if (reg.test(url)) {
      let obj = URL[key], name = obj.name
      callback = obj.callback
      url.replace(reg, function () {
        for (let i in name) {
          data[name[i]] = arguments[~~i + 1]
        }
      })
      break
    }
  }

  if (callback) {
    let result = callback(url, data)
    let promise = new Promise(function (resolve, reject) {
      setTimeout(function () {
        if (result.code === 200) {
          resolve(result)
        } else {
          reject(result)
        }
      }, 200)
    })
    return success ? promise.then(success, error) : promise
  } else {
    console.log(url, '未查找到对应的控制器')
  }
}

export default {
  'get': function (url, data, success, error) {
    return ajax('', url, data, success, error)
  },
  'post': function (url, data, success, error) {
    return ajax('post', url, data, success, error)
  },
  'put': function (url, data, success, error) {
    return ajax('put', url, data, success, error)
  },
  'delete': function (url, data, success, error) {
    return ajax('delete', url, data, success, error)
  }
}
