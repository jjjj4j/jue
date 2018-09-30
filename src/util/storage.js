(function (win, $) {
  let db = win.DB = {},
      SN = 'pvm2-',
      store = win.localStorage,
      getName = function (name) {
        return name.replace(SN, '')
      },
      set = function (key, value) {
        db[key] = value
        merge(key)
      },
      get = function (key) {
        return db[key]
      },
      remove = function (key) {
        delete db[key]
        store.removeItem(SN + key)
      },
      merge = function (key) {
        store.setItem(SN + key, JSON.stringify(db[key]))
      },
      createGetFn = function (context, defValue) {
        return function () {
          return get(context) || (typeof defValue === 'undefined' ? {} : defValue)
        }
      },
      createSetFn = function (context) {
        return function (data) {
          set(context, data)
        }
      },
      createGetFnByUrl = function (context) {
        return function (url) {
          return (get(context) || {})[url]
        }
      },
      createSetFnByUrl = function (context) {
        return function (url, data) {
          var map = get(context) || {}
          map[url] = data
          set(context, map)
        }
      }
  
  $.extend({
    tmp (key, value) {
      if ($.isUndefined(value)) {
        return db[key]
      } else {
        db[key] = value
      }
    },
    db: {
      clear: function () {
        Object.keys(store).forEach(function (key) {
          if (key.indexOf(SN) === 0) {
            remove(key.replace(SN, ''))
          }
        })
      },
      setIndexTitle: createSetFn('index-title'),
      getIndexTitle: createGetFn('index-title', !1),
      setNameStatus: createSetFn('name-log-status'),
      getNameStatus: createGetFn('name-log-status', !1),
      setAdminStatus: createSetFn('admin-log-status'),
      getAdminStatus: createGetFn('admin-log-status', !1),
      setFingerPluginTip: createSetFn('finger-plugin-tip'),
      getFingerPluginTip: createGetFn('finger-plugin-tip', !1),
      setUser: createSetFn('user'),
      getUser: createGetFn('user'),
      setPermit: createSetFn('permit'),
      getPermit: createGetFn('permit'),
      setNav: createSetFn('nav'),
      getNav: createGetFn('nav'),
      getUrlHistory: createGetFn('url-history', ''),
      setUrlHistory: createSetFn('url-history'),
      getDefaultUrl: (mod) => {
        let list = $.db.getNav()
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
      },
      getNavHistory: createGetFnByUrl('nav-history'),
      setNavHistory: createSetFnByUrl('nav-history'),
      initGroupTree () {
        $.tmp('group', [])
        $.tmp('group-top', 0)
        $.tmp('group-active', null)
      }
    }
  })
  
  /**
   * 初始化localStorage数据
   * */
  $.each(store, function (key) {
    if (key.indexOf(SN) === 0) {
      db[getName(key)] = JSON.parse(store.getItem(key))
    }
  })
})(window, window.jQuery)
