import { isDefined, isUndefined } from './core'
import { each } from './array'
import { json2str, str2json } from './json'

const SN = 'pvm3-'
const db = window.DB = {}
const store = window.localStorage

let getName = function (name) {
  return name.replace(SN, '')
}
let get = function (key) {
  return db[key]
}
let set = function (key, value) {
  tmp(key, value)
  merge(key)
}
let merge = function (key) {
  if (isDefined(key)) {
    store.setItem(SN + key, json2str(db[key]))
  }
}
let remove = function (key) {
  delete db[key]
  store.removeItem(SN + key)
}

export function tmp (key, value) {
  if (isUndefined(value)) {
    return db[key]
  } else {
    db[key] = value
  }
}

export function clear (key) {
  if (isUndefined(key)) {
    Object.keys(store).forEach(function (key) {
      if (key.indexOf(SN) === 0) {
        remove(key.replace(SN, ''))
      }
    })
  } else {
    remove(key)
  }
}
export function createGetFn (context, defValue) {
  return function () {
    return get(context) || (isUndefined(defValue) ? {} : defValue)
  }
}
export function createSetFn (context) {
  return function (data) {
    set(context, data)
  }
}
export function createGetFnByUrl (context) {
  return function (url) {
    return (get(context) || {})[url]
  }
}
export function createSetFnByUrl (context) {
  return function (url, data) {
    let map = get(context) || {}
    map[url] = data
    set(context, map)
  }
}

const setIndexTitle = createSetFn('index-title')
const getIndexTitle = createGetFn('index-title', !1)
const setNameStatus = createSetFn('name-log-status')
const getNameStatus = createGetFn('name-log-status', !1)
const setAdminStatus = createSetFn('admin-log-status')
const getAdminStatus = createGetFn('admin-log-status', !1)
const setFingerPluginTip = createSetFn('finger-plugin-tip')
const getFingerPluginTip = createGetFn('finger-plugin-tip', !1)
const setUser = createSetFn('user')
const getUser = createGetFn('user')
const setPermit = createSetFn('permit')
const getPermit = createGetFn('permit')
const setNav = createSetFn('nav')
const getNav = createGetFn('nav')
const getUrlHistory = createGetFn('url-history', '')
const setUrlHistory = createSetFn('url-history')
const getDefaultUrl = (mod) => {
  let list = getNav()
  if (mod) {
    for (let i in list) {
      if (list[i].path.indexOf(mod) === 1) {
        return list[i].children[0].path
      }
    }
  }
  if (
    list[0] &&
      list[0].children &&
      list[0].children[0]
  ) {
    return list[0].children[0].path
  }
  return ''
}
const getNavHistory = createGetFnByUrl('nav-history')
const setNavHistory = createSetFnByUrl('nav-history')
const initGroupTree = function () {
  tmp('group', [])
  tmp('group-top', 0)
  tmp('group-active', null)
}

export {
  setIndexTitle,
  getIndexTitle,
  setNameStatus,
  getNameStatus,
  setAdminStatus,
  getAdminStatus,
  setFingerPluginTip,
  getFingerPluginTip,
  setUser,
  getUser,
  setPermit,
  getPermit,
  setNav,
  getNav,
  getUrlHistory,
  setUrlHistory,
  getDefaultUrl,
  getNavHistory,
  setNavHistory,
  initGroupTree
}

/**
 * 初始化localStorage数据
 * */
each(store, function (value, key) {
  if (key.indexOf(SN) === 0) {
    db[getName(key)] = str2json(value)
  }
})
