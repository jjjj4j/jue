import log from './log'
import Prefix from './prefix'
import ajax from './ajax'
import listService from './api'
import ProdService from './controller-prod'

let TEST = !1,
    URLS = listService(),
    Service = {}

$.each(URLS, function (i, v) {
  if (Service[v[0]]) {
    throw new Error('接口名称：' + v[0] + ' 已被占用，请修改')
  }
  Service[v[0]] = function () {
    let param, fnList = []
    $.each(arguments, function (i, obj) {
      if ($.isFunction(obj)) {
        fnList.push(obj)
      } else if (obj instanceof log) {
        obj.push(v[0])
      } else if (obj instanceof Prefix) {
      } else {
        param = param || obj
      }
    })
    return ajax[v[2]]($.isArray(param) ? v[1] : $.tpl(v[1], param), param, fnList[0], fnList[1])
  }
})

export default window.Service = TEST ? Service : ProdService
