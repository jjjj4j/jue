let _PARENT_ = 'parent'
let _FOLDER_ = 'folder'
let _CHILD_ = 'child'

export default {
  data: function () {
    let {
      isShow,
      isEdit,
      autoInit,
      width,
      selectable,
      pagination,
      list,
      column,
      folder,
      icon,
      ajax,
      colVis,
      colGroup,
      color,
      defaultStatus,
      click,
      checked,
      search,
      scrollTop,
      searchTop,
      active,
      filter
    } = this.setting
    return {
      cacheSearch: search,
      search: '',
      normalTop: scrollTop || 0,
      searchTop: searchTop || 0,
      loading: !1,
      step: 30,
      nodeHeight: 40,
      normalIndex: [],
      searchIndex: [],
      currentPage: 1,
      pageSize: 10,
      totalSize: 0,
      topChecked: !1,
      checkedCache: [], // 针对分页设置
      active: active || {},
      filter,
      isShow,
      isEdit: $.isUndefined(isEdit) ? !0 : isEdit,
      autoInit,
      width,
      selectable,
      pagination,
      list,
      column,
      folder,
      icon,
      ajax,
      colVis,
      colGroup,
      color,
      defaultStatus,
      click,
      checked,
      showFilter: !1
    }
  },
  props: {
    setting: Object
  },
  methods: {
    isSearch (success = () => !0, fail = () => !1) {
      if (this.search) {
        return success.call(this)
      } else if (this.filter) {
        if (this.filter.isExist()) {
          return success.call(this)
        }
      }
      return fail.call(this)
    },
    formatNode (node = {}, attrs, isDelAttr) {
      isDelAttr = $.isUndefined(isDelAttr) ? !0 : isDelAttr
      $.extend(node, attrs)
      if (!(this.ajax && this.ajax.open)) {
        delete node.ajaxed
        delete node.ajaxing
      }
      if (
        isDelAttr &&
          node.jtype === _CHILD_
      ) {
        delete node.open
        delete node.open2
        delete node.ajaxed
        delete node.ajaxing
        delete node.children
        delete node.children2
      }
      return node
    },
    get (cache, cache2) {
      let flag = this.isSearch() && !this.pagination
      let value = (v) => {
        return $.isFunction(v) ? v() : v
      }
      if (flag) {
        return value(cache2)
      } else {
        return value(cache)
      }
    },
    set (obj, attr, attr2, value, isAll) {
      if (isAll) {
        obj[attr] = value
        obj[attr2] = value
      } else {
        this.get(() => {
          obj[attr] = value
        }, () => {
          obj[attr2] = value
        })
      }
      return obj
    },
    getActive () {
      return this.active
    },
    setActive (node) {
      this.active = this.cacheNode(node.id, node.jtype)
    },
    getChecked (node) {
      return this.get(node.checked, node.checked2)
    },
    getOpen (node) {
      return this.get(node.open, node.open2)
    },
    getChildren (node) {
      return this.get(node.children, node.children2)
    },
    getIndex () {
      return this.get(this.normalIndex, this.searchIndex)
    },
    getOpenList (data) {
      let openList = []
      let getList = (data) => {
        if (data && data.length > 0) {
          for (let i = 0; i < data.length; i++) {
            let node = data[i],
              children = this.getChildren(node)
            openList.push(node)
            if (this.getOpen(node) && children) {
              getList(children, node)
            }
          }
        }
      }
      getList(data)
      return openList
    },
    getPosterity (array, filter, isRecursive = !0) {
      let data = {
        list: [],
        length: 0,
        allLength: 0
      }
      let getList = (list) => {
        if (list && list.length > 0) {
          for (let i = 0; i < list.length; i++) {
            let node = list[i]
            if (filter) {
              if (filter(node)) {
                data.list.push(node)
                data.length++
              }
            } else {
              data.list.push(node)
              data.length++
            }
            data.allLength++
            if (isRecursive) {
              getList(this.getChildren(node))
            }
          }
        }
      }
      getList(array)
      return data
    },
    getNodeIndex (list, node) {
      let getNodeIndex = this.getNodeIndex,
        flag = true
      if (list && list.length > 0) {
        list.forEach((obj, i) => {
          if (node === obj) {
            list.splice(i, 1)
            return (flag = false)
          } else {
            return getNodeIndex(this.getChildren(obj), node)
          }
        })
      }
      return flag
    },
    getCheckedList () {
      if (this.pagination) {
        return Array.from(this.checkedCache)
      }
      return this.getPosterity(this.list, (obj) => this.getChecked(obj)).list
    },
    getCheckedNum (node, isRecursive) {
      let data = this.getPosterity(this.getChildren(node), (obj) => this.getChecked(obj), isRecursive)
      if (data.length === 0 || data.length === data.allLength) {
        return data.length
      }
      return !0
    },
    setPermit (node, status) {
      if (
        node.jtype === _CHILD_ ||
          (
            !(this.ajax && this.ajax.open) &&
              !this.pagination
          )
      ) {
        this.set(node, 'checked', 'checked2', status, !0)
      } else {
        this.set(node, 'checked', 'checked2', status)
      }
    },
    setParentPermit (node) {
      if (node) {
        this.setPermit(node, this.getCheckedNum(node) !== 0)
        this.setParentPermit(node.parent)
      }
    },
    isIndeterminate (node) {
      return this.getCheckedNum(node) === !0
    },
    setChildrenAttr (data, attr) {
      this.getPosterity(data, (obj) => {
        if ($.isFunction(attr)) {
          attr(obj)
        } else {
          $.extend(obj, attr)
        }
      })
    },
    removeCacheNode (node) {
      delete this.cache[node.id + node.jtype]
      delete this.cache[node.id]
    },
    cacheNode (node, jtype) {
      switch (jtype) {
        case _FOLDER_:
          return this.cacheGroup(node)
        case _CHILD_:
          return this.cacheChild(node)
        default:
          return this.cacheParent(node)
      }
    },
    cacheParent (node) {
      return $.isPlainObject(node) ? (this.cache[node.id + node.jtype] = node) : this.cache[node + _PARENT_]
    },
    cacheGroup (node) {
      return $.isPlainObject(node) ? (this.cache[node.id] = node) : this.cache[node]
    },
    cacheChild (node, attr) {
      if ($.isPlainObject(node)) {
        let child = this.cache[node.id + node.jtype]
        if (child) {
          attr ? attr.forEach((v) => {
            child[v] = node[v]
          }) : $.extend(child, node)
        } else {
          this.cache[node.id + node.jtype] = child = node
        }
        return child
      } else {
        return this.cache[node + _CHILD_]
      }
    },
    delNode (id, jtype = 'parent') {
      let cacheNode = this.cacheNode(id, jtype)
      if (cacheNode) {
        let children = cacheNode.children
        let delFromIndex = (list, node) => {
          let index = list.indexOf(node)
          if (index >= 0) {
            list.splice(index, 1)
          }
        }
        let delFromList = (node) => {
          let parent = node.parent
          let list
          if (parent) {
            list = parent.children
          } else {
            list = this.list
          }
          delFromIndex(list, node)
        }
        
        delFromList(cacheNode)
        delFromIndex(this.normalIndex, cacheNode)
        delFromIndex(this.searchIndex, cacheNode)
        
        if (children) {
          for (let i = children.length - 1; i >= 0; i--) {
            this.delNode(children[i], children[i].jtype)
          }
        }
        this.setCheckedCache(cacheNode)
        this.removeCacheNode(cacheNode)
      }
    },
    addNode (obj, jtype = 'parent') {
      let cacheNode = this.cacheNode(obj.id, jtype)
      if (cacheNode) {
        this.updateNode(obj, jtype)
      } else {
        let parentType = jtype === _CHILD_ ? (this.folder ? _FOLDER_ : _PARENT_) : _PARENT_
        let parent = this.cacheNode(obj.pId, parentType)
        let newNode = $.extend({}, obj, {
          id: obj.id,
          pId: parentType === _FOLDER_ ? obj.pId + _FOLDER_ : obj.pId,
          name: obj.name,
          open: !1,
          checked: parent && parent.checked || !1,
          deep: (parent && parent.deep || 0) + 1,
          jtype: jtype,
          parent: parent
        })
        let addFromList = (node) => {
          let list
          if (parent) {
            list = parent.children
            if (!list) {
              this.$set(parent, 'children', list = [])
            }
          } else {
            list = this.list
          }
          list.splice(0, 0, newNode)
        }
        
        addFromList(newNode)
        this.cacheNode(newNode, jtype)
        this.initIndexPrototype(this.normalIndex, (obj) => obj.children, (obj) => obj.open, this.list, 0, !0, !0)
        this.get(0, () => {
          this.searchEvent(this.search)
        })
      }
    },
    updateNode (obj, jtype = 'parent') {
      let cacheNode = this.cacheNode(obj.id, jtype)
      let updateFromIndex = (list, node) => {
        let index = list.indexOf(node)
        if (index >= 0) {
          list.splice(index, 1, node)
        }
      }
      
      if (cacheNode) {
        if (cacheNode.pId !== obj.pId) {
          let delFromList = (node) => {
            let list
            let parent = cacheNode.parent
            if (parent) {
              list = parent.children
            } else {
              list = this.list
            }
            list.splice(list.indexOf(node), 1)
          }
          let addFromList = (node) => {
            let list
            let jtype = node.parent && node.parent.jtype
            let parent = this.cacheNode(obj.pId, jtype)
            if (parent) {
              list = parent.children
              if (!list) {
                this.$set(parent, 'children', list = [])
              }
            } else {
              list = this.list
            }
            node.parent = parent
            list.splice(0, 0, node)
          }
          
          delFromList(cacheNode)
          addFromList(cacheNode)
          
          this.initIndexPrototype(this.normalIndex, (obj) => obj.children, (obj) => obj.open, this.list, 0, !0, !0)
          this.get(0, () => {
            this.searchEvent(this.search)
          })
        }
        
        $.extend(cacheNode, obj)
        updateFromIndex(this.normalIndex, cacheNode)
        updateFromIndex(this.searchIndex, cacheNode)
      }
    },
    init (arg) {
      let ajax = this.ajax
      let hasInitAjax = ajax && ajax.init
      let ajaxAfter = ajax && ajax.initAfter || $.noop
      let callback = $.isFunction(arg) ? arg : $.noop
      let pageInfo = $.isPlainObject(arg) ? arg : {}
      let formatData = (list, jtype, flag) => {
        list.forEach((obj) => {
          if (flag) {
            if (obj.children) {
              formatData(obj.children, jtype, flag)
            }
          } else {
            this.formatNode(obj, {
              deep: 0,
              jtype: obj.jtype || jtype,
              open: !!obj.open,
              open2: !!obj.open2,
              checked: !1,
              checked2: !1,
              ajaxed: !!obj.ajaxed,
              ajaxing: !1,
              children: [],
              children2: []
            })
          }
          this.cacheNode(obj, obj.jtype)
        })
        if (!flag) {
          return $.array2tree(list)
        }
      }
      let pagingAjax = () => {
        $.extend(this, pageInfo)
        ajax.init({
          sort: this.sort,
          pageSize: this.pageSize,
          currentPage: this.currentPage,
          search: this.search
        }).then((data) => {
          $.splice(this.list, formatData(data.list, _PARENT_))
          if (this.selectable) {
            let num = 0
            let map = {}
            let cache = this.cache
            let checkedCache = this.checkedCache
            data.list.forEach((obj) => {
              if (this.ajax.open) {
                map[obj.id] = obj
              }
              checkedCache[obj.id + obj.jtype] && (obj.checked = !0) && num++
            })
            if (this.ajax.open) {
              for (let i in cache) {
                let node = cache[i]
                if (node.jtype === _CHILD_) {
                  let isChecked = checkedCache[node.id + node.jtype]
                  let parent = map[node.parent.id]
                  if (isChecked) {
                    node.checked = !0
                  }
                  if (parent) {
                    parent.children.push(node)
                  }
                }
              }
            }
            this.topChecked = num !== 0
          }
          this.initIndex(this.list, 0, !0, !0)
          this.totalSize = data.totalSize
          this.loading = !1
          setTimeout(() => {
            ajaxAfter.call(this)
            this.setScrollTop(0)
          }, 250)
        })
      }
      let treeAjax = () => {
        ajax.init().then((list) => {
          $.splice(this.list, formatData(list, _PARENT_))
          this.initIndex(this.list, 0, !0, !0)
          this.setActive(this.list.length > 0 && this.list[0] || {})
          this.loading = !1
          ajaxAfter.call(this)
          callback.call(this)
        })
      }
      
      if (hasInitAjax) {
        this.loading = !0
        if (this.pagination) {
          pagingAjax()
        } else {
          treeAjax()
        }
      } else {
        if (this.list.length > 0 && $.isUndefined(this.list[0].deep)) {
          $.splice(this.list, formatData(this.list, _PARENT_))
          this.setActive(this.list.length > 0 && this.list[0] || {})
          this.initIndex(this.list, 0, !0, !0)
        } else {
          /**
           * 使用缓存初始化jtree
           * list 初始化
           * active 初始化
           * search 初始化
           * scrollTop 初始化
           * searchTop 初始化
           * */
          formatData(this.list, _PARENT_, !0)
          this.initIndex(this.list, 0, !0, !0, () => {
            let top = this.searchTop
            let $search = $('input[type=search]', this.$el.children[0])
            if (this.cacheSearch) {
              this.searchEvent(this.cacheSearch, top)
              $search.val(this.cacheSearch)
            } else {
              top = this.scrollTop
            }
            setTimeout(() => {
              this.setScrollTop(top)
            }, 250)
          })
        }
        ajaxAfter.call(this)
        callback.call(this)
      }
    },
    initIndex (array, deep, isOpen, delFlag, callback) {
      this.initIndexPrototype(
        this.getIndex(),
        this.getChildren,
        this.getOpen,
        array, deep, isOpen, delFlag
      )
      if (callback) {
        callback()
      }
    },
    initIndexPrototype (list, getChildren, getOpen, array, deep, isOpen, delFlag) {
      delFlag && list.splice(0, list.length)
      $.each(array, (i, obj) => {
        let children = getChildren(obj)
        obj.deep = deep
        isOpen && list.push(obj)
        if (children) {
          this.initIndexPrototype(list, getChildren, getOpen, children, deep + 1, isOpen && !!getOpen(obj))
        }
      })
    },
    toggleOpen (node) {
      let children = this.getChildren(node),
        indexList = this.getIndex(),
        openList = this.getOpenList(children),
        length = openList.length
      
      if (this.getOpen(node)) {
        indexList.splice(node.j + 1, length)
      } else {
        openList.unshift(0)
        openList.unshift(node.j + 1) &&
        indexList.splice.apply(indexList, openList)
      }
      this.set(node, 'open', 'open2', !this.get(node.open, node.open2))
    },
    open (node) {
      let me = this
      let isPermitTree = !!this.defaultStatus
      let formatData = (obj, data, isDelAttr) => {
        let child = this.cacheChild(obj.id)
        if (child) {
          child.name = obj.name
          obj = child
        } else {
          this.formatNode(obj, data, isDelAttr)
          this.cacheChild(obj)
        }
        return obj
      }
      let openAjax = () => {
        let promise = me.ajax.open(node), ajax = promise
        let isDelAttr = !0
        let folder = this.folder
        node.ajaxed = !0
        node.ajaxing = !0
        
        if ($.isArray(promise)) {
          ajax = promise[0]
          folder = promise[1]
          isDelAttr = promise[2]
        }
        
        ajax.then((r) => {
          if (r.length > 0) {
            if (folder) {
              let groupId = node.id + _FOLDER_
              let group = this.cacheGroup(groupId)
              if (!group) {
                group = {
                  id: groupId,
                  pId: node.id,
                  name: folder,
                  open: !1,
                  checked: node.checked,
                  deep: node.deep + 1,
                  jtype: _FOLDER_,
                  parent: node,
                  children: []
                }
                if (isPermitTree) {
                  group['data-color-status'] = $.extend({}, node['data-color-status'])
                  group['data-search-status'] = $.extend({}, this.defaultStatus)
                  group['data-role-status'] = $.extend({}, this.defaultStatus)
                  group['data-user-status'] = $.extend({}, this.defaultStatus)
                }
                node.children.splice(0, 0, group)
                this.cacheGroup(group)
              }
              $.splice(group.children, r.map((obj) => {
                if (isPermitTree) {
                  obj['data-color-status'] = $.extend({}, group['data-color-status'])
                  obj['data-search-status'] = $.extend({}, this.defaultStatus)
                  obj['data-role-status'] = $.extend({}, this.defaultStatus)
                  obj['data-user-status'] = $.extend({}, this.defaultStatus)
                }
                return formatData(obj, {
                  pId: groupId,
                  deep: node.deep + 2,
                  checked: node.checked,
                  checked2: node.checked,
                  jtype: _CHILD_,
                  parent: group
                }, isDelAttr)
              }))
            } else {
              $.splice(node.children, r.map((obj) => {
                return formatData(obj, {
                  pId: node.id,
                  deep: node.deep + 1,
                  checked: node.checked,
                  checked2: node.checked,
                  jtype: _CHILD_,
                  parent: node
                }, isDelAttr)
              }))
            }
            if (!isPermitTree) {
              this.setParentPermit(folder ? this.cacheGroup(node.id + _FOLDER_) : node)
            }
          } else if (!node.children || node.children.length === 0) {
            delete node.children
          }
          this.toggleOpen(node)
          node.ajaxing = !1
          node.ajaxed = !0
        }).catch(() => {
          node.ajaxed = !1
        })
      }
      
      if (
        me.ajax &&
          me.ajax.open &&
          node.jtype !== _FOLDER_ &&
          !node.open && !$.isUndefined(node.open) &&
          !node.ajaxed && !$.isUndefined(node.ajaxed) &&
          (!this.isSearch() || this.pagination)
      ) {
        openAjax()
      } else {
        this.toggleOpen(node)
      }
    },
    searchEvent (e, scrollTop) {
      let search
      let isPermitTree = !!this.defaultStatus
      let getParent = (node, list, cache) => {
        if (node && !cache[node.id]) {
          $.splice(node.children2 || [])
          if (isPermitTree) {
            $.extend(node['data-search-status'], node['data-color-status'])
          }
          node.checked2 = !1
          node.open2 = !0
          list.push(node)
          cache[node.id] = node
          getParent(node.parent, list, cache)
        }
      }
      let pagingEvent = (search) => {
        if (search) {
          this.init({
            search: search
          })
        } else {
          this.search = search
          if (this.pagination) {
            this.init()
          } else {
            setTimeout(() => {
              this.setScrollTop()
            }, 250)
          }
        }
      }
      let staticEvent = () => {
        let list = []
        let cache = []
        let getSearchResult = (data) => {
          data.forEach((obj) => {
            let children = obj.children
            if (obj.name.indexOf(search) >= 0) {
              list.push(obj)
              cache[obj.id] = obj
              $.splice(obj.children2 || [])
              getParent(obj.parent, list, cache)
            }
            if (children) {
              getSearchResult(children)
            }
          })
        }
        getSearchResult(this.list)
        this.search = search
        this.setScrollTop(this.scrollTop = scrollTop || 0)
        this.initIndex($.array2tree(list, 'id', 'pId', 'children2'), 0, !0, !0)
      }
      let ajaxEvent = () => {
        this.loading = !0
        this.ajax.search({
          search: search
        }).then((r) => {
          let list = []
          let cache = []
          let setChecked = (node, flag) => {
            if (node) {
              node.checked2 = flag
              setChecked(node.parent, flag)
            }
          }
          
          $.each(r, (i, obj) => {
            let parent = this.cacheParent(obj.pId)
            let group = this.cacheGroup(obj.pId + _FOLDER_)
            let child = this.cacheChild(obj.id)
            if (!group) {
              group = {
                id: obj.pId + _FOLDER_,
                pId: parent.id,
                name: this.folder,
                deep: parent.deep + 1,
                checked: parent.checked,
                checked2: parent.checked,
                jtype: _FOLDER_,
                parent: parent,
                children: []
              }
              if (isPermitTree) {
                group['data-color-status'] = $.extend({}, parent['data-color-status'])
                group['data-search-status'] = $.extend({}, this.defaultStatus)
                group['data-role-status'] = $.extend({}, this.defaultStatus)
                group['data-user-status'] = $.extend({}, this.defaultStatus)
              }
              parent.children.unshift(group)
              this.cacheGroup(group)
            } else {
              if (isPermitTree) {
                $.extend(group['data-search-status'], group['data-color-status'])
              }
            }
            
            group.children2 = group.children2 || []
            
            if (!child) {
              child = obj
              this.formatNode(child, {
                pId: obj.pId + _FOLDER_,
                jtype: _CHILD_,
                checked: group.checked,
                checked2: group.checked
              })
              
              if (isPermitTree) {
                child['data-color-status'] = $.extend({}, group['data-color-status'])
                child['data-search-status'] = $.extend({}, this.defaultStatus)
                child['data-role-status'] = $.extend({}, this.defaultStatus)
                child['data-user-status'] = $.extend({}, this.defaultStatus)
              }
              group.children.push(child)
              this.cacheChild(child)
            } else {
              child.name = obj.name
              if (isPermitTree) {
                $.extend(child['data-search-status'], child['data-color-status'])
              }
            }
            
            list.push(child)
            getParent(group, list, cache)
          })
          
          let array = $.array2tree(list, 'id', 'pId', 'children2')
          this.search = search
          this.getPosterity(list, (obj) => {
            if (obj.jtype === _CHILD_ && obj.checked2) {
              setChecked(obj.parent, !0)
            }
          })
          
          setTimeout(() => {
            this.loading = !1
          }, 100)
          this.setScrollTop(this.scrollTop = scrollTop || 0)
          this.initIndex(array, 0, !0, !0)
        })
      }
      let isSearch = (search, success = () => !0, fail = () => !1) => {
        if (search) {
          return success.call(this)
        } else if (this.filter) {
          if (this.filter.isExist()) {
            return success.call(this)
          }
        }
        return fail.call(this)
      }
      
      if (e) {
        if (e.target) {
          search = $('input[type=search]:first', this.$el).val()
        } else {
          search = e
        }
      } else {
        search = this.search
      }
      
      if (isSearch(search)) {
        if (this.pagination) {
          pagingEvent(search)
        } else if (this.ajax && this.ajax.search) {
          ajaxEvent()
        } else {
          staticEvent()
        }
      } else {
        pagingEvent(search)
      }
    },
    setCheckedCache (node, flag) {
      let cache = this.checkedCache
      if (node) {
        let obj = cache[node.id + node.jtype]
        if (flag) {
          if (!obj) {
            cache.push(node)
            cache[node.id + node.jtype] = node
          }
        } else {
          if (obj) {
            delete cache[node.id + node.jtype]
            cache.splice(cache.indexOf(obj), 1)
          }
        }
      } else {
        $.splice(cache)
      }
    },
    changeChecked (node, $event) {
      this.set(node, 'checked', 'checked2', $event.target.checked)
      this.setPermit(node, this.getChecked(node))
      if (this.pagination) {
        this.setChildrenAttr(this.getChildren(node), (child) => {
          child.checked = node.checked
          this.setCheckedCache(child, child.checked)
        })
        this.setCheckedCache(node, node.checked)
        this.setParentPermit(node.parent)
        this.setTopChecked()
      } else {
        this.setChildrenAttr(this.getChildren(node), (obj) => {
          this.setPermit(obj, this.getChecked(node))
        })
        this.setParentPermit(node.parent)
      }
      this.checked && this.checked(node)
      this.$forceUpdate()
    },
    clear (callback) {
      let $search = $('input[type=search]', this.$el.children[0])
      
      if (this.pagination) {
        this.currentPage = 1
        this.totalSize = 0
      }
      
      this.cache = {}
      this.list = []
      this.checkedCache = []
      this.normalIndex = []
      this.searchIndex = []
      this.normalTop = 0
      this.searchTop = 0
      
      $search.val(this.cacheSearch = this.search = '')
      $.fire(callback)
    },
    wheelEvent (e) {
      $.timer('wheelEvent', () => {
        this.setScrollTop(-e.wheelDelta, !0)
      }, 10)
    },
    scrollEvent (e) {
      $.timer('scrollEvent', () => {
        this.scrollTop = e.target.scrollTop
      }, 10)
    },
    setScrollTop (top, delta) {
      let isPermitTree = !!this.defaultStatus
      let $js = this.$el.children[isPermitTree ? 0 : 1].children[1]
      top = $.isUndefined(top) ? this.scrollTop : top
      if (delta) {
        $js.scrollTop += top
      } else {
        $js.scrollTop = top
      }
    },
    getLine (node) {
      let str = [],
        lineY = {
          'line-y': true
        }
      for (let i = 0; i < node.deep; i++) {
        str.push(lineY)
      }
      return str
    },
    isHideArrow (node) {
      let flag = this.ajax && this.ajax.open && node.ajaxed === !1
      return this.isSearch(() => {
        if (this.pagination) {
          if (flag) {
            return !1
          } else {
            return !node.children || !node.children.length
          }
        } else {
          return !node.children2 || !node.children2.length
        }
      }, () => {
        if (flag) {
          return !1
        } else {
          return !node.children || !node.children.length
        }
      })
    },
    cssArrows (node) {
      return this.getOpen(node) ? 'el-icon-arrow-down' : 'el-icon-arrow-right'
    },
    setIcon (node) {
      let icon = this.icon
      if ($.isFunction(icon)) {
        return icon(node)
      } else {
        if (node.deep === 0) {
          return icon.root || icon[node.jtype]
        } else {
          return icon[node.jtype]
        }
      }
    },
    hackIE9: $.hack.tooltips,
    getSearchTip () {
      let list = ['名称']
      return $.tpl('可检索：{text}', {
        text: list.join('、')
      })
    }
  },
  directives: {
    drag: {
      bind (el, binding) {
        let data = {
          width: 0,
          x: 0,
          y: 0
        }
        let move = (e) => {
          let width = data.width + e.pageX - data.x
          if (width > 100 && width < 400) {
            binding.value.splice(1, 1, width)
          }
        }
        let up = () => {
          window.removeEventListener('mousemove', move)
          window.removeEventListener('mouseup', up)
        }
        
        el.addEventListener('mousedown', function (e) {
          e.stopPropagation()
          e.preventDefault()
          
          data.width = binding.value[1]
          Object.assign(data, {
            left: e.target.offsetLeft,
            x: e.pageX
          })
          
          window.addEventListener('mousemove', move)
          window.addEventListener('mouseup', up)
        })
      }
    }
  },
  computed: {
    tableWidth () {
      let width = 0
      if (this.colVis) {
        this.colVis.forEach((obj) => {
          width += obj[1]
        })
      } else {
        width = '100%'
      }
      return $.isNumeric(width) ? width : '100%'
    },
    scrollTop: {
      get () {
        return this.isSearch(() => this.searchTop, () => this.normalTop)
      },
      set (top) {
        this.isSearch(() => {
          this.searchTop = top
        }, () => {
          this.normalTop = top
        })
      }
    },
    indexList () {
      return this.getIndex()
    },
    blockList () {
      let step = this.step,
        nodeHeight = this.nodeHeight,
        indexList = this.indexList,
        scrollTop = this.scrollTop
      
      return (() => {
        let index = ~~(scrollTop / nodeHeight),
          start = index,
          end = index + step,
          list = indexList.slice(start, end + 1)
        
        return $.for(list, (node) => {
          node.i = (this.currentPage - 1) * this.pageSize + start + 1
          node.j = start++
        })
      })()
    }
  },
  mounted () {
    this.cache = {}
    if (this.autoInit !== !1) {
      this.init()
    }
  }
}
