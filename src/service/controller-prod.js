import { each, map } from '@/util/array'
import { isArray, isDefined, isFunction } from '@/util/core'
import { tpl } from '@/util/char'
import { getUser, setUser } from '@/util/storage'
import { json2str } from '@/util/json'
import { listService } from './api'

import log from './log'
import Prefix from './prefix'
import Vue from 'vue'

let URLS = listService()
let Service = {}
let is404 = !1
let isTimeout = !0

each(URLS, function (v) {
  if (Service[v[0]]) {
    throw new Error('接口名称：' + v[0] + ' 已被占用，请修改')
  }
  Service[v[0]] = function () {
    let param, prefix, fnList = []
    let requestFilter = [
      function (param) {
        if (isDefined(param.currentPage)) {
          param.page = param.currentPage
        }
      }
    ]
    let responseFilter = [
      function (result) {
        if (isDefined(result.data)) {
          let data = result.data
          if (isDefined(data.count)) {
            data.totalSize = data.count
          }
          if (isDefined(data.page)) {
            data.currentPage = data.page
          }
        }
      }
    ]
    let filter = function (param, list) {
      if (param) {
        map(list, (fn) => {
          fn(param)
        })
      }
      return param
    }
    each(arguments, function (obj) {
      if (isFunction(obj)) {
        fnList.push(obj)
      } else if (obj instanceof log) {
        obj.push(v[0])
      } else if (obj instanceof Prefix) {
        prefix = obj
      } else {
        param = param || obj
      }
    })
    return new Promise(function (resolve, reject) {
      if (param) {
        filter(param, requestFilter)
      }
      let url = isArray(param) ? v[1] : tpl(v[1], param)
      let isText = v[3] === 'text/plain'
      let error = (message) => {
        return (new Vue()).$notify.error({
          title: '错误',
          message
        })
      }
      let error404 = tpl('数据获取失败，请检测网络连接', {
        api: v[0]
      })
      let settings = {
        method: v[2],
        url: prefix ? prefix.format(url) : url,
        cache: false,
        data: param,
        dataType: 'json',
        timeout: 600000
      }
      let clearUserInfo = () => {
        let user = getUser()
        delete user.tokenKey
        setUser(user)
      }

      if (isText) {
        settings.data = json2str(param)
        settings.contentType = v[3]
      }

      $.ajax(settings).then((r, s, xhr) => {
        r = filter(r, responseFilter)
        if (r.code === 200) {
          fnList[0] && fnList[0](r, xhr)
          resolve(r)
        } else {
          if (r.code === 302) {
            if (!isTimeout) {
              let time = 3
              let msg = '登录超时，{time}秒后自动跳转到登录页面'
              let $error = error(tpl(msg, { time }))

              /* 删除用户tokenKey,防止重新调转到index.html */
              clearUserInfo()

              /* 添加定时器 */
              setInterval(() => {
                if (time > 1) {
                  $error.message = tpl(msg, {
                    time: --time
                  })
                } else {
                  window.location.href = '/login.html'
                }
              }, 1000)
            } else {
              clearUserInfo()
              window.location.href = '/login.html'
            }
            isTimeout = !0
          } else {
            fnList[1] ? fnList[1](r) : error(tpl('{msg}', {
              msg: r.data.message,
              api: v[0]
            }))
          }
          reject(r)
        }
      }, () => {
        if (!is404) {
          is404 = !!error(error404)
          setTimeout(() => {
            is404 = !1
          }, 4000)
        }
        reject({
          code: 404,
          data: {
            message: error404
          }
        })
      })
    })
  }
})

export default window.Service = Service
