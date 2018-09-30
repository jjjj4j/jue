import { URL } from './data'

let paramReg = /{(.+?)}/g

export default function (url, controller, method) {
  let name = []
  let _url_ = url.replace(paramReg, function () {
    name.push(arguments[1])
    return '([0-9a-zA-Z\\-]+)'
  })
  _url_ = method ? '^' + method + '\\|' + _url_ + '$' : '^' + _url_ + '$'
  
  URL[_url_] = {
    name: name,
    callback: controller
  }
}
