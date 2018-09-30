export let _PARENT_ = 'parent'
export let _FOLDER_ = 'folder'
export let _CHILD_ = 'child'

export let maxLength = $.isIE9() ? 30000 : 800000

export let posterity = (list, callback, recursive) => {
  $.for(list, (node) => {
    callback(node)
    if (recursive) {
      posterity(recursive(node), callback, recursive)
    }
  })
}

export let isSearch = function (search, success = () => !0, fail = () => !1) {
  if (search) {
    return success.call(this)
  } else if (this.filter) {
    if (this.filter.isExist()) {
      return success.call(this)
    }
  }
  return fail.call(this)
}
