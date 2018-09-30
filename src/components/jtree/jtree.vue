<template>
  <div :class="isTable ? 'tc' : 'ec'">
    <div class="toolbar">
      <slot name="btns"></slot>
      <div class="search">
        <form @submit.prevent="searchEvent">
          <input type="search"/>
          <el-tooltip ref="tooltip"
                      effect="light"
                      placement="top-end"
                      :content="getSearchTip()"
                      @input="hackIE9">
            <a @click="searchEvent"><span class="el-icon-search"></span></a>
          </el-tooltip>
        </form>
      </div>
    </div>
    <div class="jt">
      <div class='jb'>
        <div class='jb-h' v-if="isTable">
          <table :width="tableWidth">
            <colgroup>
              <col :width="col[1]" v-for='col in colVis'>
            </colgroup>
            <thead>
            <tr>
              <th v-for='col in colVis'>
                <span class="ellipsis"
                      :class="{'text-right': column[col[0]].btnCol}">{{column[col[0]].name}}</span>
                <div class="drag"
                     v-if="column[col[0]].drag !== !1 && !column[col[0]].btnCol"
                     v-drag="col"></div>
              </th>
            </tr>
            </thead>
          </table>
        </div>
        <div @mousewheel.stop.prevent="wheelEvent" class='jb-c' v-loading="loading">
          <table :width="tableWidth" v-if="blockList.length > 0">
            <colgroup>
              <col :width="col[1]" v-for='col in colVis'>
            </colgroup>
            <tbody class="no-line">
            <tr :class="{active: node.id === active.id && !isTable}"
                v-for='(node, index) in blockList'>
              <td v-for='col in colVis' :class="column[col[0]].id">
                <slot :name="column[col[0]].id" v-if="column[col[0]].slot" :node="node"></slot>
                <div class="name"
                     :title="node[column[col[0]].id]"
                     v-loading="node.ajaxing"
                     v-else-if="col[2]">
                  <div :class="line" v-for="line in getLine(node)"></div>
                  <span class="no-open" v-if="isHideArrow(node)">&nbsp;</span>
                  <span @click.stop="openEvent(node)" v-else>
                      <i :class="cssArrows(node)"></i>
                  </span>
                  <a :style="`width:calc(100% - ${node.deep * 10 + 20}px)`" v-if="selectable" @click.stop>
                    <label class="el-checkbox" size="small" @click="changeChecked(node)">
                      <span class="el-checkbox__input" :class="getCheckboxClass(node)">
                        <span class="el-checkbox__inner"></span>
                      </span>
                      <span class="el-checkbox__label">
                        <a :style="`width:calc(100% - 15px)`" @click.prevent="click(node)">
                          <span :class="setIcon(node)" v-if="icon"></span>
                          <span class="ellipsis" :style="linkWidth()">{{node[column[col[0]].id]}}</span>
                        </a>
                      </span>
                    </label>
                  </a>
                  <a :style="`width:calc(100% - ${node.deep * 10 + 20}px)`" @click.prevent="click(node)" v-else>
                    <span :class="setIcon(node)" v-if="icon"></span>
                    <span class="ellipsis" :style="linkWidth()">{{node[column[col[0]].id]}}</span>
                  </a>
                </div>
                <div class="ellipsis"
                     v-else-if="column[col[0]].data"
                     v-html="column[col[0]].data(node)"></div>
                <slot name="btnCol" v-else-if="column[col[0]].btnCol" :node="node"></slot>
                <div class="ellipsis" v-else>{{node[column[col[0]].id]}}</div>
              </td>
            </tr>
            </tbody>
          </table>
          <div class="center-vertical" v-else>
            <div class="add-info">
              <i class="ico ico-empty-info"></i>
              <div>尚未检索到任何数据</div>
            </div>
          </div>
        </div>
      </div>
      <div @scroll="scrollEvent" class='js'>
        <div :style="scrollHeight()"></div>
      </div>
      <div class="jl" v-if="isTable">
        <table width="100%">
          <thead>
          <tr>
            <th></th>
          </tr>
          </thead>
        </table>
        <table width="100%">
          <tbody>
          <tr v-for='(node, index) in blockList'>
            <td></td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import { _PARENT_, _FOLDER_, _CHILD_, maxLength, posterity, isSearch } from './util'

export default {
  name: 'jtree',
  data: function () {
    let me = this
    let {
      list,
      autoInit,
      step,
      active,
      width,
      selectable,
      column,
      colVis,
      colGroup,
      folder,
      icon,
      ajax,
      click,
      check,
      search,
      scrollTop,
      searchTop,
      filter
    } = this.setting

    me.list = list || []
    me.nodeHeight = 40
    me.step = step || 10
    me.autoStep = !step

    $.extend(me, {
      active,
      autoInit,
      folder,
      icon,
      selectable,
      ajax,
      click: click || $.noop,
      check,
      filter
    })

    return {
      search,
      loading: !1,
      normalTop: scrollTop || 0,
      searchTop: searchTop || 0,
      width,
      column: column || [
        {
          'id': 'name',
          'name': '名称',
          'keyCol': !0
        }
      ],
      colVis: colVis || [[0, '100%', !0]],
      colGroup,
      showFilter: !1
    }
  },
  props: {
    setting: Object
  },
  methods: {
    startA (callback) {
      this.loading = !0
      $.fire(callback)
    },
    closeA (callback) {
      $.fire(callback)
      setTimeout(() => {
        this.loading = !1
      }, 100)
    },
    hideFilter () {
      this.showFilter = !1
    },
    isSearch (success = () => !0, fail = () => !1) {
      return isSearch.call(this, this.search, success, fail)
    },
    get (cache, cache2) {
      let flag = this.isSearch()
      let value = (v) => {
        return $.isFunction(v) ? v() : v
      }
      return value(flag ? cache2 : cache)
    },
    set (obj, attr, attr2, value, isAll) {
      if (isAll) {
        obj[attr] = value
        obj[attr2] = value
      } else {
        obj[this.isSearch() ? attr2 : attr] = value
      }
      return obj
    },
    getActive () {
      return this.active
    },
    setActive (node) {
      if (node && node.id) {
        this.active = this.cacheNode(node.id, node.jtype)
      } else {
        this.active = node
      }
      this.$nextTick(this.draw)
    },
    setDefActive () {
      if (!this.active) {
        this.setActive(this.list.length > 0 ? this.list[0] : {})
      }
    },
    getScrollRate () {
      return this.get(this['scrollRate'] || 1, this['scrollRate2'] || 1)
    },
    setScrollRate (top) {
      let me = this
      let length = me.getIndexList().length
      let rate = length > maxLength ? length / maxLength : 1
      let oldRate = me.getScrollRate()
      let oldTop = $.isUndefined(top) ? me.scrollTop : top
      let scrollTop = oldTop

      if (rate !== oldRate) {
        scrollTop = oldTop * oldRate / rate
        me.set(me, 'scrollRate', 'scrollRate2', rate)
      }

      me.scrollTop = scrollTop
      me.draw()
      me.$nextTick(() => me.setScrollTop())
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
    getIndexList () {
      return this.get((this.normalIndex = this.normalIndex) || [], (this.searchIndex = this.searchIndex) || [])
    },
    getPosterity (array, filter, recursive) {
      let data = {
        list: [],
        length: 0,
        allLength: 0
      }

      posterity(
        array,
        (node) => {
          if (filter(node)) {
            data.list.push(node)
          }
          ++data.allLength
        },
        recursive
      )

      data.length = data.list.length

      return data
    },
    getCheckedList () {
      return this.getPosterity(this.list, (node) => node.checked, (node) => node.children).list
    },
    getCheckedNum (node) {
      let data = this.getPosterity(this.getChildren(node), (node) => this.getChecked(node), (node) => this.getChildren(node))
      if (data.length === 0 || data.length === data.allLength) {
        return data.length
      }
      return !0
    },
    isChecked (node) {
      let me = this
      let validate = (list) => {
        for (let i in list) {
          let item = list[i]
          if (this.getChecked(item)) {
            return !0
          }
          let children = me.getChildren(item)
          if (children && children.length > 0) {
            if (validate(children)) {
              return !0
            }
          }
        }
      }
      return validate(me.getChildren(node)) || !1
    },
    setPermit (node, status) {
      this.set(node, 'checked', 'checked2', status, node.jtype === _CHILD_ || !(this.ajax && this.ajax.open))
    },
    setParentPermit (node, checked) {
      let me = this
      if (me.selectable && node) {
        me.clearIndeterminate(node)
        me.setPermit(node, checked = checked || me.isChecked(node))
        me.setParentPermit(node.parent, checked)
      }
    },
    isIndeterminate (node) {
      if (node.jtype === _CHILD_) {
        return !1
      }
      let status = this.get(node['isIndeterminate'], node['isIndeterminate2'])
      if (!$.isUndefined(status)) {
        return status
      }
      this.set(node, 'isIndeterminate', 'isIndeterminate2', status = this.getCheckedNum(node) === !0)
      return status
    },
    clearIndeterminate (node) {
      if (this.selectable && node.jtype !== _CHILD_) {
        delete node['isIndeterminate']
        delete node['isIndeterminate2']
      }
    },
    removeCacheNode (node) {
      delete this.cache[node.id + node.jtype]
      delete this.cache[node.id]
    },
    cacheNode (node, jtype) {
      if (node) {
        jtype = node.jtype || jtype
        switch (jtype) {
          case _FOLDER_:
            return this.cacheGroup(node)
          case _CHILD_:
            return this.cacheChild(node)
          default:
            return this.cacheParent(node)
        }
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
    clear (callback) {
      this.cache = {}
      this.list = []
      this.active = {}
      this.normalIndex = []
      this.blockList = []
      this.normalTop = 0
      this.clearSearch()
      $.fire(callback)
    },
    clearSearch (callback) {
      $('input[type=search]', this.$el.children[0]).val('')
      this.searchIndex = []
      this.searchTop = 0
      this.search = this.cacheSearch = ''
      $.fire(callback)
    },
    delNode (id, jtype = _PARENT_, isDraw = !0) {
      let node = this.cacheNode(id, jtype)
      if (node) {
        let children = node.children
        let delFromIndex = (list, node) => {
          let index = list.indexOf(node)
          if (index >= 0) {
            list.splice(index, 1)
          }
        }
        let delFromList = (node) => {
          delFromIndex(node.parent ? node.parent.children : this.list, node)
        }

        delFromList(node)
        delFromIndex(this.normalIndex, node)
        delFromIndex(this.searchIndex, node)

        if (children) {
          for (let i = children.length - 1; i >= 0; i--) {
            this.delNode(children[i], children[i].jtype, !1)
          }
        }

        this.removeCacheNode(node)

        if (isDraw) {
          this.draw()
        }
      }
    },
    addNode (obj, jtype = _PARENT_) {
      let cacheNode = this.cacheNode(obj.id, jtype)
      if (cacheNode) {
        this.updateNode(obj, jtype)
      } else {
        let parent
        let tpl = {
          id: obj.id,
          name: obj.name,
          open: !1,
          deep: 0,
          jtype: jtype,
          parent: parent
        }

        if (this.selectable) {
          tpl.checked = !1
        }

        if (obj.pId) {
          let parentType = jtype === _CHILD_ ? (this.folder ? _FOLDER_ : _PARENT_) : _PARENT_

          tpl.pId = parentType === _FOLDER_ ? obj.pId + _FOLDER_ : obj.pId

          parent = this.cacheNode(obj.pId, parentType)

          if (parent) {
            parent.children = parent.children || []
            tpl.deep = parent.deep + 1
            tpl.parent = parent

            if (this.selectable) {
              tpl.checked = parent.checked
            }
          }
        }

        let newNode = $.extend({}, obj, tpl)
        let addFromList = (node) => {
          let list
          if (parent) {
            list = parent.children
          } else {
            list = this.list
          }
          list.splice(0, 0, newNode)
        }

        addFromList(newNode)
        this.cacheNode(newNode, jtype)
        this.initIndexPrototype(this.normalIndex, (obj) => obj.children, (obj) => obj.open, this.list, 0, !0, !0)

        this.get(() => {
          this.draw()
        }, () => {
          this.searchEvent(this.search)
        })
      }
    },
    updateNode (obj, jtype = _PARENT_) {
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
        } else {
          updateFromIndex(this.normalIndex, cacheNode)
        }

        $.extend(cacheNode, obj)

        this.get(() => {
          this.draw()
        }, () => {
          this.searchEvent(this.search)
        })
      }
    },
    init (callback) {
      let me = this
      let { init, initAfter } = me.ajax || {}
      let initNode = (list, jtype, flag) => {
        $.for(list, (node) => {
          if (flag) {
            initNode(node.children, jtype, flag)
          } else {
            let attr = {
              deep: 0,
              jtype: node.jtype || jtype
            }
            if (this.selectable) {
              attr.checked = attr.checked2 = !1
            }
            if (attr.jtype !== _CHILD_) {
              attr.open = !!node.open
              attr.open2 = !!node.open2
              attr.children = []
              attr.children2 = []

              if (this.ajax && this.ajax.open) {
                attr.ajaxed = !!node.ajaxed
                attr.ajaxing = !1
              }
            }
            $.extend(node, attr)
          }
          this.cacheNode(node, node.jtype)
        })
        if (!flag) {
          return $.array2tree(list)
        }
        return list
      }
      let ajaxEvent = () => {
        return init().then((list) => {
          return $.splice(me.list, initNode(list, _PARENT_))
        })
      }
      let staticEvent = () => {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            resolve($.splice(me.list, initNode(me.list, _PARENT_, me.list.length > 0 && !$.isUndefined(me.list[0].deep))))
          }, 200)
        })
      }

      me.startA(() => {
        (init ? ajaxEvent : staticEvent)().then(() => {
          me.setDefActive()
          me.initIndexPrototype(
            me.normalIndex = me.normalIndex || [],
            node => node.children,
            node => node.open,
            me.list, 0, !0, !0
          )
          $.fire.call(me, initAfter)
          $.fire.call(me, callback)
        }).then(() => {
          let search = me.search
          if (search) {
            me.searchEvent(search, me.scrollTop)
            $('input[type=search]', me.$el.children[0]).val(search)
          } else {
            me.closeA(() => {
              me.setScrollRate()
            })
          }
        })
      })
    },
    initIndex (array, deep, isOpen, isClear) {
      this.initIndexPrototype(
        this.getIndexList(),
        this.getChildren,
        this.getOpen,
        array, deep, isOpen, isClear
      )
    },
    initIndexPrototype (list, getChildren, getOpen, array, deep, isOpen, isClear) {
      isClear && list.splice(0, list.length)
      $.for(array, (node) => {
        node.deep = deep
        isOpen && list.push(node)
        let children = getChildren(node)
        if (children) {
          this.initIndexPrototype(list, getChildren, getOpen, children, deep + 1, isOpen && !!getOpen(node))
        }
      })
    },
    openEvent (node) {
      let me = this
      let initNode = (node, tpl) => {
        let child = me.cacheChild(node.id)
        if (child) {
          child.name = node.name
        } else {
          child = $.extend(node, tpl)
          me.cacheChild(child)
        }
        return child
      }
      let ajaxEvent = () => {
        let promise = me.ajax.open(node), ajax = promise
        let folder = me.folder
        let handle = (list) => {
          $.splice(node.children, list.map((obj) => {
            let tpl = {
              pId: node.id,
              deep: node.deep + 1,
              jtype: _CHILD_,
              parent: node
            }
            if (me.selectable) {
              tpl.checked = tpl.checked2 = node.checked
            }
            return initNode(obj, tpl)
          }))
          return node
        }
        let folderHandle = (list) => {
          let groupId = node.id + _FOLDER_
          let group = me.cacheGroup(groupId)
          if (!group) {
            group = {
              id: groupId,
              pId: node.id,
              name: folder,
              open: !1,
              deep: node.deep + 1,
              jtype: _FOLDER_,
              parent: node,
              children: []
            }
            if (me.selectable) {
              group.checked = node.checked
            }
            node.children.splice(0, 0, group)
            me.cacheGroup(group)
          } else {
            me.clearIndeterminate(group)
          }
          $.splice(group.children, list.map((obj) => {
            let tpl = {
              pId: groupId,
              deep: node.deep + 2,
              jtype: _CHILD_,
              parent: group
            }
            if (me.selectable) {
              tpl.checked = tpl.checked2 = node.checked
            }
            return initNode(obj, tpl)
          }))

          return group
        }

        node.ajaxed = !0
        node.ajaxing = !0

        me.clearIndeterminate(node)
        me.draw()

        if ($.isArray(promise)) {
          ajax = promise[0]
          folder = promise[1]
        }

        return ajax.then((r) => {
          if (r.length > 0) {
            me.setParentPermit((folder ? folderHandle : handle)(r))
          } else if (node.children.length === 0) {
            delete node.children
          }
          node.ajaxing = !1
          node.ajaxed = !0
        }, () => {
          node.ajaxing = !1
          node.ajaxed = !1
        })
      }
      let staticEvent = () => {
        return new Promise((resolve, reject) => {
          resolve(!0)
        })
      }
      let findList = (list, result = []) => {
        $.for(list, (node) => {
          result.push(node)
          if (me.getOpen(node)) {
            findList(me.getChildren(node), result)
          }
        })
        return result
      }

      ((
        me.ajax &&
            me.ajax.open &&
            node.jtype !== _FOLDER_ &&
            !node.open && !$.isUndefined(node.open) &&
            !node.ajaxed && !$.isUndefined(node.ajaxed) &&
            !me.isSearch()
      ) ? ajaxEvent : staticEvent)().then(() => {
        let indexList = me.getIndexList()
        let openList = findList(me.getChildren(node))
        let length = openList.length

        if (me.getOpen(node)) {
          $.splice(indexList, 0, node.j + 1, length)
        } else {
          $.splice(indexList, openList, node.j + 1)
        }

        me.set(node, 'open', 'open2', !me.get(node.open, node.open2))
        me.setScrollRate()
      })
    },
    searchEvent (e, scrollTop) {
      let me = this, search, list = [], cache = []
      let getParent = (node, list, cache) => {
        if (node && !cache[node.id]) {
          cache[node.id] = node
          node.open2 = !0
          /* 调整本部在列表中的位置 */
          if (node.jtype === _FOLDER_) {
            list.unshift(node)
          } else {
            list.push(node)
          }
          $.splice(node.children2)
          /* 递归获取上级分组 */
          getParent(node.parent, list, cache)
        }
      }
      // TODO 对搜索结果中的分组设置checked属性（性能过低）
      let checkParent = (array) => {
        let setChecked = (node, flag) => {
          if (node) {
            node.checked2 = flag
            setChecked(node.parent, flag)
          }
        }
        $.for(array, (node) => {
          if (node.jtype === _CHILD_) {
            if (node.checked2) {
              setChecked(node.parent, !0)
            }
          } else {
            node.checked2 = !1
            me.clearIndeterminate(node)
          }
        })
      }
      let clearEvent = (search) => {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            resolve(!0)
          }, 300)
        })
      }
      let staticEvent = () => {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            resolve(
              posterity(
                me.list,
                (node) => {
                  if (node.name.indexOf(search) >= 0) {
                    list.push(node)
                    cache[node.id] = node
                    getParent(node.parent, list, cache)
                    $.splice(node.children2)
                  }
                },
                (node) => {
                  return node.children
                }
              )
            )
          }, 300)
        })
      }
      let ajaxEvent = () => {
        return me.ajax.search({
          search: search
        }).then((r) => {
          $.for(r, (obj) => {
            let parent = me.cacheParent(obj.pId)
            let group = me.cacheGroup(obj.pId + _FOLDER_)
            let child = me.cacheChild(obj.id)
            if (!group) {
              group = {
                id: obj.pId + _FOLDER_,
                pId: parent.id,
                name: me.folder,
                deep: parent.deep + 1,
                jtype: _FOLDER_,
                parent: parent,
                children: []
              }

              parent.children.unshift(group)
              me.cacheGroup(group)
            } else {
              me.clearIndeterminate(group)
            }

            group.children2 = group.children2 || []

            if (!child) {
              child = obj
              let tpl = {
                pId: obj.pId + _FOLDER_,
                jtype: _CHILD_
              }
              if (me.selectable) {
                tpl.checked = tpl.checked2 = group.checked
              }

              group.children.push($.extend(child, tpl))
              me.cacheChild(child)
            } else {
              child.name = obj.name
            }

            list.push(child)
            getParent(group, list, cache)
          })
        })
      }

      if (e) {
        if (e.target) {
          search = $('input[type=search]:first', me.$el).val()
        } else {
          search = e
        }
      } else {
        search = me.search
      }

      me.startA(() => {
        let promise
        if (isSearch.call(me, search)) {
          if (me.ajax && me.ajax.search) {
            promise = ajaxEvent()
          } else {
            promise = staticEvent()
          }
        } else {
          promise = clearEvent()
        }
        promise.then((status) => {
          me.search = search

          if (!status) {
            me.initIndex($.array2tree(list, 'id', 'pId', 'children2'), 0, !0, !0)
            if (me.selectable) {
              checkParent(me.getIndexList())
            }
          }

          me.closeA(() => {
            me.setScrollRate(status ? me.scrollTop : (me.scrollTop = scrollTop || 0))
          })
        })
      })
    },
    getCheckboxClass (node) {
      let me = this, name
      let isIndeterminate = me.isIndeterminate(node)
      if (isIndeterminate) {
        name = 'is-indeterminate'
      } else if (me.getChecked(node)) {
        name = 'is-checked'
      }
      return name
    },
    changeChecked (node) {
      let me = this
      let checked = me.getChecked(node)
      let isIndeterminate = me.isIndeterminate(node)

      checked = !(checked || isIndeterminate)

      /**
         * 设置当前节点的选中状态
         * 删除半选状态， 在页面执行 draw() 的时候会重新计算
         * */
      me.setPermit(node, checked)
      me.clearIndeterminate(node)

      /* 批量设置下级节点的选中状态 */
      posterity(
        me.getChildren(node),
        (node) => {
          me.setPermit(node, checked)
          me.clearIndeterminate(node)
        },
        (node) => me.getChildren(node)
      )

      /* 递归设置上级节点的选中状态 */
      me.setParentPermit(node.parent, checked)

      /* 执行回调函数 */
      $.fire(me.check, node)

      me.$forceUpdate()
    },
    wheelEvent (e) {
      this.setScrollTop(-e.wheelDelta, !0)
    },
    scrollEvent (e) {
      let scrollTop = e.target.scrollTop
      if (scrollTop !== this.scrollTop) {
        this.scrollTop = scrollTop
        $.timer('scrollEvent', () => {
          this.draw()
        }, 10)
      }
    },
    setScrollTop (top, delta) {
      let $js = this.$el.children[1].children[1]
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
        return !node.children2 || !node.children2.length
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
    linkWidth () {
      let width = 0
      if (this.icon) {
        width += 20
      }
      if (this.selectable) {
        width += 20
      }
      return `width: calc(100% - ${width}px)`
    },
    scrollHeight () {
      let jsHeight = $('.js', this.$el).height() || 0
      let nodeHeight = this.nodeHeight
      let length = this.getIndexList().length
      let rate = this.getScrollRate()
      if (rate > 1) {
        length = maxLength
      }
      let remedy = $.int(jsHeight * (rate - 1) / rate + (length > this.step ? 1 : 0) * nodeHeight / rate) + 1
      return {
        height: (length + (this.isTable ? 2 : 0)) * nodeHeight + remedy + 'px'
      }
    },
    hackIE9: $.hack.tooltips,
    getSearchTip () {
      let list = []
      $.for(this.column, (col) => {
        if (
          col.id &&
              col.id !== 'i' &&
              !col.closeSearchTip
        ) {
          list.push(col.name)
        }
      })
      return $.tpl('可检索：{text}', {
        text: list.join('、')
      })
    },
    draw () {
      let step = this.step
      let rate = this.getScrollRate()
      let nodeHeight = this.nodeHeight
      let indexList = this.getIndexList()
      let scrollTop = this.scrollTop
      let index = ~~Math.round(scrollTop * rate / nodeHeight)

      $.splice(
        this.blockList,
        $.for(indexList.slice(index, index + step + 1), (node) => {
          node.j = index
          node.i = ++index
        })
      )

      this.$forceUpdate()
    }
  },
  computed: {
    isTable () {
      return this.colVis.length > 1
    },
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
        return this.isSearch(() => this.searchTop, () => this.normalTop) || 0
      },
      set (top) {
        this.isSearch(() => {
          this.searchTop = top
        }, () => {
          this.normalTop = top
        })
      }
    }
  },
  created () {
    this.cache = {}
    this.blockList = []
  },
  mounted () {
    let me = this
    let $win = $(window)
    me.cache = {}

    if (me.autoInit !== !1) {
      me.init()
    }

    if (me.autoStep !== !1) {
      me.jid = $.uuid()
      me.$nextTick(() => {
        setTimeout(() => {
          $win.trigger('resize.' + me.jid)
        }, 200)
      })
      $win.bind('resize.' + me.jid, () => {
        let $jb = $('.jb', me.$el)
        if ($jb.is(':visible')) {
          let $float = $jb.height() / me.nodeHeight
          let $int = $.int($float)
          me.step = $float > $int ? $int + 1 : $int
          me.draw()
        }
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
  destroyed () {
    this.cache = {}
    this.list = []
    this.active = {}
    this.normalIndex = []
    this.searchIndex = []
    this.blockList = []

    if (this.autoStep !== !1) {
      $(window).unbind('resize.' + this.jid)
    }
  }
}

</script>
