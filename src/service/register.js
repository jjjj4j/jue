import data from './data'

var paramReg = /{(.+?)}/g,
    URL = data.URL

export default function (url, controller, method) {
  var name = [],
      _url_ = url.replace(paramReg, function () {
        name.push(arguments[1])
        return '([0-9a-zA-Z\\-]+)'
      })
  _url_ = method ? '^' + method + '\\|' + _url_ + '$' : '^' + _url_ + '$'
  
  URL[_url_] = {
    name: name,
    callback: controller
  }
}
