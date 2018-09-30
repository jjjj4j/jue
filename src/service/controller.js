import { isArray, isFunction } from '@/util/core'
import { listService } from './api'
import { each } from '@/util/array'
import { tpl } from '@/util/char'

import log from './log'
import Prefix from './prefix'
import ajax from './ajax'
import ProdService from './controller-prod'

let TEST = !0
let URLS = listService()
let Service = {}

each(URLS, function (v) {
  if (Service[v[0]]) {
    throw new Error('接口名称：' + v[0] + ' 已被占用，请修改')
  }
  Service[v[0]] = function () {
    let param, fnList = []
    each(arguments, function (obj) {
      if (isFunction(obj)) {
        fnList.push(obj)
      } else if (obj instanceof log) {
        obj.push(v[0])
      } else if (obj instanceof Prefix) {
      } else {
        param = param || obj
      }
    })
    return ajax[v[2]](isArray(param) ? v[1] : tpl(v[1], param), param, fnList[0], fnList[1])
  }
})

export default window.Service = TEST ? Service : ProdService
