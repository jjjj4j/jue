import data from './data'

let db = data.db

export default {
  'fr': function (data) {
    data = data || {}
    data.message = '成功'
    return {
      code: 200,
      data: data
    }
  },
  'fa': function (code) {
    return {
      code: code || 400,
      data: {
        message: 'error'
      }
    }
  },
  'random': function () {
    let length = arguments.length
    let max = (length).toString(16)
    let index = $.random16((max + '').length, 0, length - 1)
    return arguments[$.int('0x' + index)]
  },
  'getFirst': function (modal) {
    for (let key in db[modal]) {
      return db[modal][key]
    }
  },
  'getModal': function (modal) {
    return db[modal]
  },
  'getObj': function (modal, id) {
    return $.extend(true, {}, db[modal][id])
  },
  'getModalTemplate': function (modal) {
    return $.extend({}, this.getFirst(modal))
  },
  'getByAttr': function (modal, attrs, filter) {
    let data = db[modal]
    c : for (let id in data) {
      let obj = data[id]
      if (attrs) {
        for (let i = 0; i < attrs.length; i++) {
          let key = attrs[i][0],
              value = attrs[i][1]
          if (obj[key] != value) {
            continue c
          }
        }
      }
      if (filter && !filter.call(obj)) {
        continue c
      }
      return obj
    }
  },
  'getAllByAttr': function (modal, attrs, filter) {
    let data = $.extend(true, {}, db[modal]),
        list = []
    c : for (let id in data) {
      let obj = data[id]
      if (attrs) {
        for (let i = 0; i < attrs.length; i++) {
          let key = attrs[i][0],
              value = attrs[i][1]
          if (obj[key] != value) {
            continue c
          }
        }
      }
      if (filter && !filter.call(obj)) {
        continue c
      }
      list.push(obj)
    }
    return list
  },
  'page': function (modal, args, attrs) {
    let data = $.extend(true, {}, db[modal]),
        list = [],
        filter = function (obj) {
          if (args.search) {
            if (typeof args.searchType != 'undefined') {
              if (obj.searchType != args.searchType) {
                return false
              }
            }
            for (let attrName in obj) {
              let attr = obj[attrName]
              if (typeof attr === 'string' && attr.indexOf(args.search) >= 0) {
                return true
              }
            }
            return false
          }
          return true
        }

    c : for (let id in data) {
      let obj = data[id]
      if (filter(obj)) {
        if (attrs) {
          for (let i = 0; i < attrs.length; i++) {
            let key = attrs[i][0],
                value = attrs[i][1]
            if ($.isArray(value)) {
              let flag = true
              value.forEach(function (v) {
                if (obj[key] == v) {
                  return flag = false
                }
              })
              if (flag) {
                continue c
              }
            } else if (obj[key] != value) {
              continue c
            }
          }
        }
        list.push(obj)
      }
    }

    let currentPage = $.int(args.currentPage),
        pageSize = $.int(args.pageSize),
        start = ((currentPage || 1) - 1) * (pageSize || 10),
        end = start + (pageSize || 10)
    return this.fr({
      currentPage: currentPage || 1,
      totalSize: list.length,
      pageSize: pageSize || 10,
      list: list.slice(start, end)
    })
  },
  'get': function (modal, id) {
    return this.fr({
      object: $.extend(true, {}, db[modal][id])
    })
  },
  'save': function (modal, obj, flag) {
    let old = db[modal][obj.id]
    if (old) {
      $.extend(old, obj)
    } else {
      obj.id = $.uuid()
      old = obj
    }
    db[modal][obj.id] = $.str2json($.json2str(old))
    //return flag ? {id: obj.id} : this.fr({id: old.id})
    return this.fr({id: flag ? obj.id : old.id})
  },
  'getGroupChildren': function (modal, args) {
    let d = this.getAllByAttr('groups', [])
    let arr = []
    for (let i = 0; i < d.length; i++) {
      if (d[i].parentId == args.id) {
        arr.push(d[i])
      }
    }
    return arr
  },
  // modal为数据文件名 可传数组或字符串  多个页面调用同一接口时可传数组
  'del': function (modal, id) {
    if (modal instanceof Array) {
      for (let i = 0; i < modal.length; i++) {
        if (db[modal[i]][id]) {
          delete db[modal[i]][id]
        }
      }
    } else {
      delete db[modal][id]
    }
    return this.fr()
  },
  'delByAttr': function (modal, attrs) {
    let list = this.getAllByAttr(modal, attrs)
    list.forEach(function (obj) {
      delete db[modal][obj.id]
    })
    return this.fr()
  },
  'delByIds': function (modal, ids) {
    for (let i = 0; i < ids.length; i++) {
      delete db[modal][ids[i]]
    }
    return this.fr()
  }
}
