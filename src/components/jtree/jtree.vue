<template>
  <div :class="isTable ? 'tc' : 'ec'">
    <div class="toolbar">
      <slot name="btns"></slot>
      <div class="search">
        <form @submit.prevent="searchEvent">
          <input type="search"/>
          <a @click="searchEvent"><span class="el-icon-search"></span></a>
        </form>
      </div>
    </div>
    <div class="jt">
      <optiscroll ref="opt" class='jb'
                  :step="40"
                  :vBlank="isTable? 44 : 4"
                  :autoUpdate="false"
                  :realTimeRendering="true"
                  :size="scrollHeight" @scroll="scrollEvent">
        <div class='jb-h' v-if="isTable">
          <table :width="tableWidth">
            <colgroup>
              <col :width="col[1]" v-for='col in colVis'>
            </colgroup>
            <thead>
            <tr>
              <th v-for='col in colVis'>
                <label class="el-checkbox" size="small"
                       @click="changeTopChecked()"
                       v-if="selectable && col[2]">
                  <span class="el-checkbox__input" :class="getCheckboxClass()">
                    <span class="el-checkbox__inner"></span>
                  </span>
                  <span class="el-checkbox__label">
                    {{column[col[0]].name}} (已选中{{checkedCache.length}}个)
                  </span>
                </label>
                <span class="ellipsis"
                      :class="{'text-right': column[col[0]].btnCol}"
                      v-else>{{column[col[0]].name}}</span>
                <div class="drag"
                     v-if="column[col[0]].drag !== !1 && !column[col[0]].btnCol"
                     v-drag="col"></div>
              </th>
            </tr>
            </thead>
          </table>
        </div>
        <div class='jb-c' v-loading="loading">
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
                    <label class="el-checkbox" size="small">
                      <span class="el-checkbox__input" @click="changeChecked(node)" :class="getCheckboxClass(node)">
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
      </optiscroll>
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
import { _PARENT_, _FOLDER_, _CHILD_ } from './util'
import { array2tree, each, splice, posterity } from '@/util/array'

import {
  extend,
  fire,
  isArray,
  isDefined,
  isFunction,
  isNumber,
  isPlainObject,
  isUndefined,
  inspect,
  noop,
  random16, AutoIncrementID
} from '@/util/core'
import Timer from '@/util/Timer'

const isChecked = (node) => {
  let validate = (list) => {
    if (list && list.length > 0) {
      for (let i in list) {
        let item = list[i]
        if (item.checked) {
          return !0
        }
        if (validate(item.children)) {
          return !0
        }
      }
    }
  }
  return validate(node.children) || !1
}

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
      topCheckedEvent,
      check,
      search,
      scrollTop,
      searchTop,
      filter
    } = this.setting

    me.TimerName = AutoIncrementID('TreeResize')

    me.jid = random16(8)
    me.list = list || []
    me.nodeHeight = 40
    me.step = step || 10
    me.autoStep = !step

    extend(me, {
      active,
      autoInit,
      folder,
      icon,
      selectable,
      ajax,
      click: click || noop,
      topCheckedEvent,
      check,
      filter
    })

    return {
      topChecked: !1,
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
      fire(callback)
    },
    closeA (callback) {
      fire(callback)
      setTimeout(() => {
        this.loading = !1
      }, 100)
    },
    hideFilter () {
      this.showFilter = !1
    },
    get (cache, cache2) {
      return this.searching(this.search, cache2, cache)
    },
    set (node, attr, attr2, value, isAll) {
      if (isAll) {
        node[attr] = value
        node[attr2] = value
      } else {
        node[this.searching() ? attr2 : attr] = value
      }
      return node
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
      this.update(!1)
    },
    setDefActive () {
      if (!this.active) {
        this.setActive(this.list.length > 0 ? this.list[0] : {})
      }
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
      return this.get(
        this.normalIndex = this.normalIndex || [],
        this.searchIndex = this.searchIndex || []
      )
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
      return this.getPosterity(
        this.list,
        (node) => node.checked,
        (node) => node.children
      ).list
    },
    getCheckedNum (node) {
      let data = this.getPosterity(
        this.getChildren(node),
        (node) => this.getChecked(node),
        (node) => this.getChildren(node)
      )
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
      this.set(
        node, 'checked', 'checked2', status,
        node.jtype === _CHILD_ || !(this.ajax && this.ajax.open)
      )
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
      if (isDefined(status)) {
        return status
      }
      this.set(
        node, 'isIndeterminate', 'isIndeterminate2',
        status = this.getCheckedNum(node) === !0
      )
      return status
    },
    clearIndeterminate (node) {
      if (this.selectable && node.jtype !== _CHILD_) {
        delete node['isIndeterminate']
        delete node['isIndeterminate2']
      }
    },
    isTopIndeterminate () {
      return this.getCheckedNum({ children: this.getIndexList }) === !0
    },
    setTopChecked () {
      this.topChecked = isChecked({ children: this.getIndexList() })
    },
    changeTopChecked () {
      let me = this
      let checked = !me.topChecked
      let result = fire(me.topCheckedEvent, checked)
      let success = function () {
        me.topChecked = checked
        posterity(me.list, (node) => {
          me.uncheck(node, () => {
            me.setCheckedCache(node, node.checked = checked)
          })
        })
        me.$forceUpdate()
      }
      if (result && result.then) {
        result.then(() => {
          success()
        })
      } else {
        success()
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
        each(cache, (node) => {
          node.checked = !1
          delete cache[node.id + node.jtype]
        })
        splice(cache)
      }
    },
    uncheck (node, fail, success) {
      let column, uncheck
      each(this.column, (col) => {
        if (col.keyCol) {
          return !(column = col)
        }
      })
      column && (uncheck = column.uncheck)
      uncheck ? (uncheck(node) ? success && success() : fail()) : (!success && fail())
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
      return isPlainObject(node) ? (this.cache[node.id + node.jtype] = node) : this.cache[node + _PARENT_]
    },
    cacheGroup (node) {
      debugger
      return isPlainObject(node) ? (this.cache[node.id] = node) : this.cache[node]
    },
    cacheChild (node, attr) {
      if (isPlainObject(node)) {
        let child = this.cache[node.id + node.jtype]
        if (child) {
          attr ? attr.forEach((v) => {
            child[v] = node[v]
          }) : extend(child, node)
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
      this.selectable && (this.checkedCache = [])
      this.clearSearchValue(callback)
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
          this.update()
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

        let newNode = extend({}, obj, tpl)
        let addFromList = () => {
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
        this.initIndexPrototype(
          this.normalIndex,
          (obj) => obj.children,
          (obj) => obj.open,
          this.list, 0, !0, !0
        )

        this.get(() => {
          this.update()
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

          this.initIndexPrototype(
            this.normalIndex,
            (obj) => obj.children,
            (obj) => obj.open,
            this.list, 0, !0, !0
          )
        } else {
          updateFromIndex(this.normalIndex, cacheNode)
        }

        extend(cacheNode, obj)

        this.get(() => {
          this.update(!1)
        }, () => {
          this.searchEvent(this.search)
        })
      }
    },
    init (callback) {
      let me = this
      let { init, initAfter } = me.ajax || {}
      let initNode = (list, jtype, flag) => {
        each(list, (node) => {
          if (flag) {
            initNode(node.children, jtype, flag)
          } else {
            let attr = {
              deep: 0,
              jtype: node.jtype || jtype
            }
            if (this.selectable) {
              let checked = node.checked
              if (isUndefined(checked)) {
                checked = !1
              }
              attr.checked = attr.checked2 = checked
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
            extend(node, attr)
          }
          this.cacheNode(node, node.jtype)
          this.setCheckedCache(node, node.checked)
        })
        if (!flag) {
          return array2tree(list).list
        }
        return list
      }
      let ajaxEvent = () => {
        return init().then((list) => {
          return splice(me.list, initNode(list, _PARENT_))
        })
      }
      let staticEvent = () => {
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve(splice(me.list, initNode(me.list, _PARENT_, me.list.length > 0 && isDefined(me.list[0].deep))))
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
          fire.call(me, initAfter)
          fire.call(me, callback)
        }).then(() => {
          let search = me.search
          this.searching(search, () => {
            me.searchEvent(search, me.scrollTop)
            me.searchValue(search)
          }, () => {
            me.setTopChecked()
            me.closeA(() => me.update())
          })
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
      each(array, (node) => {
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
          child = extend(node, tpl)
          me.cacheChild(child)
        }
        return child
      }
      let ajaxEvent = () => {
        let promise = me.ajax.open(node), ajax = promise
        let folder = me.folder
        let handle = (list) => {
          splice(node.children, list.map((obj) => {
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
          splice(group.children, list.map((obj) => {
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

        if (isArray(promise)) {
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
        each(list, (node) => {
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
            !node.open && isDefined(node.open) &&
            !node.ajaxed && isDefined(node.ajaxed) &&
            !me.searching()
      ) ? ajaxEvent : staticEvent)().then(() => {
        let indexList = me.getIndexList()
        let openList = findList(me.getChildren(node))
        let length = openList.length

        if (me.getOpen(node)) {
          splice(indexList, 0, node.j + 1, length)
        } else {
          splice(indexList, openList, node.j + 1)
        }

        me.set(node, 'open', 'open2', !me.get(node.open, node.open2))
        me.update()
      })
    },
    searching (search, success, fail) {
      let me = this
      let isExist = me.filter && me.filter.isExist()

      if (isFunction(search)) {
        fail = success
        success = search
        search = me.search
      } else if (isUndefined(search)) {
        search = me.search
      }

      return inspect.call(this, () => !!search || isExist, success, fail)
    },
    searchValue (data) {
      let $search = $('input[type=search]', this.$el)
      if (isDefined(data)) {
        $search.val(this.search = data)
      } else {
        data = $search.val()
      }
      return data
    },
    clearSearchValue (callback) {
      this.searchValue('')
      this.searchIndex = []
      this.searchTop = 0
      fire(callback)
    },
    searchEvent (e, scrollTop) {
      let me = this, search, list = [], cache = []
      let getParent = (node, list, cache) => {
        if (node && !cache[node.id]) {
          cache[node.id] = node
          node.open2 = !0
          // 调整本部在列表中的位置
          if (node.jtype === _FOLDER_) {
            list.unshift(node)
          } else {
            list.push(node)
          }
          splice(node.children2)
          // 递归获取上级分组
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
        each(array, (node) => {
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
      let clearEvent = () => {
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve(!0)
          }, 300)
        })
      }
      let staticEvent = () => {
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve(
              posterity(
                me.list,
                (node) => {
                  if (node.name.indexOf(search) >= 0) {
                    list.push(node)
                    cache[node.id] = node
                    getParent(node.parent, list, cache)
                    splice(node.children2)
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
          each(r, (obj) => {
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

              group.children.push(extend(child, tpl))
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
          search = this.searchValue()
        } else {
          search = e
        }
      } else {
        search = me.search
      }

      me.startA(() => {
        let promise
        if (me.searching(search)) {
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
            me.initIndex(array2tree(list, 'id', 'pId', 'children2').list, 0, !0, !0)
            if (me.selectable) {
              checkParent(me.getIndexList())
            }
          }

          me.closeA(() => {
            me.update(status ? me.scrollTop : scrollTop)
          })
        })
      })
    },
    getCheckboxClass (node) {
      let me = this, name = []
      let isIndeterminate = node ? me.isIndeterminate(node) : me.isTopIndeterminate()
      if (isIndeterminate) {
        name = ['is-indeterminate']
      } else if (node ? me.getChecked(node) : me.topChecked) {
        name = ['is-checked']
      }
      if (node) {
        this.uncheck(node, noop, () => name.push('is-disabled'))
      } else {
        this.uncheck(node, noop, () => name.push('is-disabled'))
      }
      return name.join(' ')
    },
    changeChecked (node) {
      let me = this
      let checked = me.getChecked(node)
      let isIndeterminate = me.isIndeterminate(node)
      let success = () => {
        // 设置当前节点的选中状态
        // 删除半选状态， 在页面执行 draw() 的时候会重新计算
        me.setPermit(node, checked)
        me.setCheckedCache(node, checked)
        me.clearIndeterminate(node)

        // 批量设置下级节点的选中状态
        posterity(
          me.getChildren(node),
          (node) => {
            me.setPermit(node, checked)
            me.setCheckedCache(node, checked)
            me.clearIndeterminate(node)
          },
          (node) => me.getChildren(node)
        )

        // 递归设置上级节点的选中状态
        me.setParentPermit(node.parent, checked)
        me.setTopChecked()

        me.update(!1)
      }

      checked = !(checked || isIndeterminate)

      if (me.check) {
        let result = fire(me.check, node, checked) // 执行回调函数
        if (result && result.then) {
          result.then(() => {
            success()
          })
        } else {
          success()
        }
      } else {
        success()
      }
    },
    changeChecked2 (node, checked) {
      let me = this

      checked = checked || me.getChecked(node)

      // 设置当前节点的选中状态
      // 删除半选状态， 在页面执行 draw() 的时候会重新计算
      me.setPermit(node, checked)
      me.setCheckedCache(node, checked)
      me.clearIndeterminate(node)

      // 批量设置下级节点的选中状态
      posterity(
        me.getChildren(node),
        (node) => {
          me.setPermit(node, checked)
          me.setCheckedCache(node, checked)
          me.clearIndeterminate(node)
        },
        (node) => me.getChildren(node)
      )

      // 递归设置上级节点的选中状态
      me.setParentPermit(node.parent, checked)
      me.setTopChecked()
    },
    resizeEvent () {
      let {
        $el, update, scrollHeight,
        scrollTop, nodeHeight
      } = this
      let sH, cH, $jb = $('.jb', $el)
      let $float, $int, top = 0

      if ($jb.is(':visible')) {
        sH = scrollHeight().sH
        cH = $jb.height()
        $float = cH / nodeHeight
        $int = parseInt($float)

        this.step = $float > $int ? $int + 1 : $int

        if ((cH + scrollTop) > sH) {
          top = sH - cH > 0 ? sH - cH : 0
        } else {
          top = scrollTop
        }

        update(top)
      }
    },
    scrollEvent (e) {
      this.draw(e.scrollTop)
    },
    scrollTo (top) {
      return this.$refs.opt.scrollTo(0, isUndefined(top) ? this.scrollTop : top)
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
      return this.searching(() => {
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
      let icon = fire.call(this, this.icon, node)
      if (isPlainObject(icon)) {
        if (node.deep === 0) {
          icon = icon.root || icon[node.jtype]
        } else {
          icon = icon[node.jtype]
        }
      }
      return icon
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
      let nodeHeight = this.nodeHeight
      let length = this.getIndexList().length
      let remedy = (length > this.step ? 1 : 0) * nodeHeight + 1
      return {
        sH: (length + (this.isTable ? 2 : 0)) * nodeHeight + remedy
      }
    },
    update (top, duration) {
      let { draw, scrollTo } = this
      if (top === false) {
        this.$forceUpdate()
      } else {
        draw(scrollTo(top, duration).Y)
      }
    },
    draw (top) {
      let { step, nodeHeight, blockList } = this
      let indexList = this.getIndexList()
      let scrollTop = isDefined(top) ? (this.scrollTop = top) : this.scrollTop
      let index = ~~Math.round(scrollTop / nodeHeight)

      splice(
        blockList,
        each(indexList.slice(index, index + step + 1), (node) => {
          node.j = index
          node.i = ++index
        })
      )

      this.update(!1)
    }
  },
  computed: {
    isTable () {
      return this.colVis.length > 1
    },
    tableWidth () {
      let { colVis } = this, width = 0
      if (colVis) {
        colVis.forEach((obj) => {
          width += obj[1]
        })
      } else {
        width = '100%'
      }
      return isNumber(width) ? width : '100%'
    },
    scrollTop: {
      get () {
        return this.searching(() => this.searchTop, () => this.normalTop) || 0
      },
      set (top) {
        this.searching(() => {
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
    this.checkedCache = []
  },
  mounted () {
    const {
      jid, autoInit, autoStep, TimerName,
      init, resizeEvent, $nextTick
    } = this
    const $win = $(window)

    const timer = (T) => {
      return Timer(TimerName, resizeEvent, T)
    }

    this.cache = {}
    if (autoInit !== !1) {
      init()
    }

    if (autoStep !== !1) {
      $win.bind('resize.' + jid, () => timer(25))
      $nextTick(() => timer(200))
    }
  },
  directives: {
    drag: {
      bind (el, binding, vNode) {
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
          vNode.context.$refs.opt.update()
          window.removeEventListener('mousemove', move)
          window.removeEventListener('mouseup', up)
        }

        el.addEventListener('mousedown', function (e) {
          e.stopPropagation()
          e.preventDefault()

          data.width = binding.value[1]
          extend(data, {
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
