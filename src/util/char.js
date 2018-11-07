import { isArray } from '@/util/core'

const _REG_ = /{(.+?)}/g
const _FN_REG_ = /^(fn:)(.+?)\((.*?)\)$/
const _STR_PARAM_REG_ = /([''])(.+?)\1/

const isFn = function (v) {
  return _FN_REG_.test(v)
}
const format = function (tpl, obj, tempFn) {
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
const formatList = function (tpl, i, size, list, array, tempFn) {
  while (--i >= 0) {
    let d = list[i]
    d.i = i + size + 1
    array[i] = format(tpl, d, tempFn)
  }
  return array
}

export function tpl (tpl = '', obj = {}, tempFn) {
  let result = ''
  if (isArray(obj)) {
    result = formatList(tpl, obj.length, 0, obj, [], tempFn).join('')
  } else {
    result = format(tpl, obj, tempFn)
  }
  return result
}
