import { isArray } from '@/util/core'

let _REG_ = /{(.+?)}/g
let _FN_REG_ = /^(fn:)(.+?)\((.*?)\)$/
let _STR_PARAM_REG_ = /([''])(.+?)\1/

let isFn = function (v) {
  return _FN_REG_.test(v)
}
let format = function (tpl, obj, tempFn) {
  return tpl.replace(_REG_, function () {
    let arg = arguments[1]
    if (isFn(arg)) {
      let fnData = _FN_REG_.exec(arg)
      let fnName = fnData[2]
      let fnParam = fnData[3]
      let list = []
      
      if (fnParam) {
        fnParam = fnParam.split(',')
      } else {
        fnParam = []
      }
      
      for (let param in fnParam) {
        param = fnParam[param]
        if (_STR_PARAM_REG_.test(param)) {
          param = _STR_PARAM_REG_.exec(param)[2]
        } else {
          param = obj[param]
        }
        list.push(param)
      }
      if (tempFn && tempFn[fnName]) {
        return tempFn[fnName].apply(obj, list)
      }
      return ''
    }
    return obj[arg] === undefined ? '' : obj[arg]
  })
}
let formatList = function (tpl, i, size, list, array, tempFn) {
  while (--i >= 0) {
    let d = list[i]
    d.i = i + size + 1
    array[i] = format(tpl, d, tempFn)
  }
}

export function tpl (tpl, obj, tempFn) {
  if (!tpl && !obj) {
    return ''
  }
  if (isArray(obj)) {
    if (obj.length > 0) {
      let array = []
      let list = obj
      let i = list.length
      let size = 0
      
      formatList(tpl, i, size, list, array, tempFn)
      return array.join('')
    } else {
      return ''
    }
  }
  return format(tpl, obj, tempFn)
}
