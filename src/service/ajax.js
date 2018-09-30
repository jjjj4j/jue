import data from './data'
import './entity/org'
import './entity/role'
import './entity/user'
import './entity/camera'
import './entity/permit'
import './entity/dict'
import './entity/service'
import './entity/iodGroup'
import './entity/group'
import './entity/regroup'
import './entity/device'
import './entity/terrace'
import './entity/manufacturer'
import './entity/encoder'
import './entity/decoder'
import './entity/codec'
import './entity/monitor'
import './entity/keyboard'
import './entity/videoTemplate'
import './entity/cascade'
import './entity/parentNode'
import './entity/childNode'
import './entity/node'
import './entity/otheros'
import './entity/excel'
import './entity/ad'
import './entity/shield'
import './entity/channel'

var URL = data.URL,
    ajax = function (method, url, data, success, error) {
      url = method ? method + '|' + url : url
      data = data || {}

      if (url.indexOf('?') > 0) {
        var list = url.split('?')
        url = list[0]
        $.each(list[1].split('&'), function (i, obj) {
          var dataArray = obj.split('=')
          data[dataArray[0]] = dataArray[1]
        })
      }

      var callback

      for (var key in URL) {
        var reg = new RegExp(key)
        if (reg.test(url)) {
          var obj = URL[key], name = obj.name
          callback = obj.callback
          url.replace(reg, function () {
            for (var i in name) {
              data[name[i]] = arguments[~~i + 1]
            }
          })
          break
        }
      }

      if (callback) {
        var result = callback(url, data)
        var promise = new Promise(function (resolve, reject) {
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
