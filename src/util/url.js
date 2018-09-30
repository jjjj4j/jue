(function (win, $) {
  $.extend({
    url: {
      //地址跳转
      go: function (router, url) {
        let list = url.split('/')
        if (list.length === 3) {
          $.db.setNavHistory(list[1], url)
          $.db.setUrlHistory(url)
        }
        router.push({path: url})
      },
      //格式化“a=1&b=2”类型的值为{a:1,b:2}
      format: function () {
        var search = location.search
        var params = {}
        if (search) {
          search = search.slice(1)
          var array = search.split('&')
          array.forEach(function (obj) {
            var param = obj.split('=')
            if (param[0]) {
              params[param[0]] = param[1]
            }
          })
        }
        return params
      }
    }
  })
})(window, window.jQuery)
