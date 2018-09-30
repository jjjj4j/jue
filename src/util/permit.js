import { isArray, repeat, trim } from './core'
import { str2json } from './json'
import { each, array2tree } from './array'
import { setNav, setPermit, getPermit, getUser } from './storage'
import { go } from './url'

export function getPid (id) {
  let end = 8
  let code1 = id.slice(3, 6)
  let code2 = id.slice(5, 8)
  let code3 = id.slice(8)
  if (code1 === '000') {
    end = 0
  } else if (code2 === '000') {
    end = 2
  } else if (code3 === '0000') {
    end = 5
  }
  return id.slice(0, end) + repeat(0, 12 - end)
}

export function init (list, callback) {
  let tree
  let permit = []
  /**
   * 递归获取本级及其父级模块的ext数据
   * */
  let getExt = function (obj, list) {
    if (obj.ext) {
      list.push(obj.ext)
    }
    if (obj.parent) {
      getExt(obj.parent, list)
    } else {
      list.push('')
    }
    return list
  }
  /**
   * 格式化权限数据（此处于模拟数据不一致）
   * */
  if (!isArray(list)) {
    list = str2json(list)['01']
  }
  /**
   * 生成pId, 用于构建数据树
   * */
  tree = array2tree(each(list, (obj) => (obj.pId = getPid(obj.id))))
  /**
   * 生成模块的path属性
   * */
  each(list, (obj) => {
    obj.path = getExt(obj, []).reverse().join('/')
    permit.push(obj.path.replace('/@', '.*'))
  })
  /**
   * 删除多余的数据
   * */
  each(list, (obj) => {
    if (obj.ext.indexOf('@') === 0) {
      delete obj.parent.children
    }
    delete obj.id
    delete obj.sort
    delete obj.ext
    delete obj.pId
    delete obj.label
    delete obj.parent
  })
  
  setNav(tree)
  setPermit(permit)
  callback.call()
}

export function isLogin () {
  let isLogin = !!getUser().tokenKey
  if (!isLogin) {
    go('/login.html')
  }
  return isLogin
}

export function ok (ruleStr, success, error) {
  let permitInfoList = getPermit()
  let ruleList = ruleStr.split('||')
  let hash = window.location.hash.replace(/^#/, '')
  let test = (rule) => {
    for (let i in permitInfoList) {
      let reg = new RegExp('^' + permitInfoList[i].replace(/([/-])/g, '\\$1') + '$')
      if (reg.test(rule)) {
        return !0
      }
    }
    return !1
  }
  
  ruleList = ruleList.map((rule) => {
    return rule.split('&&')
  })
  
  for (let j in ruleList) {
    let andList = ruleList[j]
    let result = !0
    for (let k in andList) {
      result = result && test(hash + trim(andList[k]))
    }
    if (result) {
      return success && success() || !0
    }
  }
  
  return error && error() || !1
}
