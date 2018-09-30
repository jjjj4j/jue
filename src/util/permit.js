(function (win, $) {
  win.IOD = !0
  $.extend({
    permit: (function () {
      let getPid = (id) => {
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
        return id.slice(0, end) + $.repeat(0, 12 - end)
      }
      return {
        pId: getPid,
        init: function (list, callback) {
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
           * 生成模块的path属性
           * */
          let getUrl = function (obj) {
            obj.path = getExt(obj, []).reverse().join('/')
            permit.push(obj.path.replace('/@', '.*'))
          }
          /**
           * 格式化权限数据（此处于模拟数据不一致）
           * */
          if (!$.isArray(list)) {
            list = $.str2json(list)['01']
          }
          /**
           * 生成pId, 用于构建数据树
           * */
          tree = $.array2tree($.for(list, (obj) => obj.pId = getPid(obj.id)))
          $.for(list, getUrl)
          /**
           * 删除多余的数据
           * */
          $.for(list, (obj) => {
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
          /**
           * 删除IOD
           * */
          if (!win.IOD) {
            tree = $.map(tree, (item) => {
              if (item.path.indexOf('iod') > 0) {
                return
              }
              return item
            })
            permit = $.map(permit, (item) => {
              if (item.indexOf('iod') > 0) {
                return
              }
              return item
            })
          }
          
          $.db.setNav(tree)
          $.db.setPermit(permit)
          callback.call()
        },
        isLogin: function () {
          let isLogin = !!$.db.getUser().tokenKey
          if (!isLogin) {
            window.location.href = '/login.html'
          }
          return isLogin
        },
        ok: function (ruleStr, success, error) {
          let permitInfoList = $.db.getPermit()
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
              result = result && test(hash + $.trim(andList[k]))
            }
            if (result) {
              return success && success() || !0
            }
          }
          
          return error && error() || !1
        }
      }
    })()
  })
})(window, window.jQuery)
