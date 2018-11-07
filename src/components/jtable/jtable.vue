<template>
  <div class="tc">
    <div class="toolbar">
      <slot name="btns"></slot>
      <div class="search" :class="{'has-filter': filter}">
        <form @submit.prevent="searchEvent">
          <div>
            <input type="search"/>
            <a @click="searchEvent"><span class="el-icon-search"></span></a>
          </div>
        </form>
      </div>
      <div class="filter" v-if="filter" v-clickoutside="hideFilter">
        <el-button ico="filter"
                   type="text"
                   :style="{
                    color: filter.isExist() ? 'red' : ''
                   }"
                   @click="showFilter = !showFilter"></el-button>
        <div class="filter-content" :class="{'hide': !showFilter}">
          <slot name="filter"></slot>
        </div>
      </div>
    </div>
    <div class="jt jp">
      <div class='jb'>
        <div class='jb-h'>
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
                    <span class="caret-wrapper"
                          :class="sort2class(column[col[0]].sort)"
                          @click.prevent.stop="sortEvent(column[col[0]])"
                          v-if="hasSort(column[col[0]].sort)">
                      <i class="sort-caret ascending"></i>
                      <i class="sort-caret descending"></i>
                    </span>
                  </span>
                </label>
                <span class="ellipsis"
                      :class="{'text-right': column[col[0]].btnCol}"
                      v-else>{{column[col[0]].name}}
                  <span class="caret-wrapper"
                        :class="sort2class(column[col[0]].sort)"
                        @click.prevent.stop="sortEvent(column[col[0]])"
                        v-if="hasSort(column[col[0]].sort)">
                    <i class="sort-caret ascending"></i>
                    <i class="sort-caret descending"></i>
                  </span>
                </span>
                <div class="drag"
                     v-if="column[col[0]].drag !== !1 && !column[col[0]].btnCol"
                     v-drag="col"></div>
              </th>
            </tr>
            </thead>
          </table>
        </div>
        <optiscroll ref="opt" class='jb-c' v-loading="loading"
                    :step="40"
                    :autoUpdate="false"
                    :realTimeRendering="true"
                    :size="scrollHeight" @scroll="scrollEvent">
          <table :width="tableWidth" v-if="blockList.length > 0">
            <colgroup>
              <col :width="col[1]" v-for='col in colVis'>
            </colgroup>
            <tbody class="no-line">
            <tr v-for='node in blockList'>
              <td v-for='col in colVis' :class="column[col[0]].id">
                <slot :name="column[col[0]].id" v-if="column[col[0]].slot" :node="node"></slot>
                <div class="name-old ellipsis"
                     :title="node[column[col[0]].id]"
                     v-loading="node.ajaxing"
                     v-else-if="col[2]">
                  <div :class="line" v-for="line in getLine(node)"></div>
                  <template v-if="ajax && ajax.open">
                    <span class="no-open" v-if="isHideArrow(node)">&nbsp;</span>
                    <span @click.stop="openEvent(node)" v-else>
                      <i :class="cssArrows(node)"></i>
                    </span>
                  </template>
                  <a v-if="selectable" @click.stop>
                    <label class="el-checkbox" size="small" @click="changeChecked(node)">
                      <span class="el-checkbox__input" :class="getCheckboxClass(node)">
                        <span class="el-checkbox__inner"></span>
                      </span>
                      <span class="el-checkbox__label">{{node[column[col[0]].id]}}</span>
                    </label>
                  </a>
                  <a v-else>
                    <span :class="setIcon(node)" v-if="icon"></span>
                    {{node[column[col[0]].id]}}
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
            <div class="add-info" @click="setting.addEvent" v-if="setting.addEvent">
              <i class="ico ico-empty-info"></i>
              <div>尚未检索到任何数据</div>
              <a>点击添加<i class="ico ico-double-right"></i></a>
            </div>
            <div class="add-info" v-else>
              <i class="ico ico-empty-info"></i>
              <div>尚未检索到任何数据</div>
            </div>
          </div>
        </optiscroll>
      </div>
      <div class="jl">
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
    <el-pagination
        layout="total, sizes, prev, pager, next, jumper"
        :current-page="currentPage"
        :page-sizes="[10, 20, 50, 100, 1000, 2000, 5000]"
        :page-size="pageSize"
        :total="totalSize"
        @size-change="sizeChange"
        @current-change="currentChange">
    </el-pagination>
  </div>
</template>

<script>
import clickoutside from 'element-ui/src/utils/clickoutside'
import { each, map, splice, array2tree, posterity as findPosterity } from '@/util/array'
import { _PARENT_, _FOLDER_, _CHILD_ } from '../jtree/util'
import {
  AutoIncrementID,
  extend,
  fire,
  inspect,
  isArray,
  isChar,
  isDefined,
  isFunction, isNumber,
  isPlainObject,
  isUndefined,
  noop, random16
} from '@/util/core'
import Timer from '@/util/Timer'

const posterity = function (list, callback, isRecursive = !0) {
  return findPosterity(
    list, callback,
    isRecursive ? (node) => node.children : isRecursive
  )
}

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
  name: 'jtable',
  data: function () {
    let me = this
    let {
      list,
      autoInit,
      step,
      width,
      selectable,
      column,
      folder,
      icon,
      ajax,
      colVis,
      colGroup,
      click,
      checked,
      search,
      scrollTop,
      filter
    } = me.setting

    me.TimerName = AutoIncrementID('TableResize')

    me.jid = random16(8)
    me.list = list || []
    me.currentPage = 1
    me.pageSize = 10
    me.totalSize = 0
    me.nodeHeight = 40
    me.step = step || 10
    me.autoStep = !step

    extend(me, {
      autoInit,
      search,
      folder,
      icon,
      selectable,
      ajax,
      click,
      checked,
      filter
    })

    return {
      loading: !1,
      width,
      scrollTop: scrollTop || 0,
      column,
      colVis,
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
      return isPlainObject(node) ? (this.cache[node.id] = node) : this.cache[node]
    },
    cacheChild (node, attr) {
      if (isPlainObject(node)) {
        let child = this.cache[node.id + node.jtype]
        if (child) {
          attr ? each(attr, (v) => {
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
    removeCacheNode (node) {
      delete this.cache[node.id + node.jtype]
      delete this.cache[node.id]
    },
    getPosterity (array, filter, isRecursive = !0) {
      let data = {
        list: [],
        length: 0,
        allLength: 0
      }

      posterity(array, (node) => {
        if (filter(node)) {
          data.list.push(node)
        }
        ++data.allLength
      }, isRecursive)

      data.length = data.list.length

      return data
    },
    isIndeterminate (node) {
      if (node.jtype === _CHILD_) {
        return !1
      }
      let status = node['isIndeterminate']
      if (isDefined(status)) {
        return status
      }
      return (node['isIndeterminate'] = this.getCheckedNum(node) === !0)
    },
    clearIndeterminate (node) {
      if (this.selectable && node.jtype !== _CHILD_) {
        delete node['isIndeterminate']
      }
    },
    isTopIndeterminate () {
      return this.getCheckedNum({ children: this.indexList }) === !0
    },
    setTopChecked () {
      this.topChecked = isChecked({ children: this.indexList })
    },
    changeTopChecked () {
      this.topChecked = !this.topChecked
      posterity(this.list, (node) => {
        this.uncheck(node, () => {
          this.setCheckedCache(node, node.checked = this.topChecked)
        })
      })
      this.$forceUpdate()
    },
    getCheckedList () {
      return this.checkedCache
    },
    getCheckedNum (node) {
      let data = this.getPosterity(node.children, (obj) => obj.checked)
      if (data.length === 0 || data.length === data.allLength) {
        return data.length
      }
      return !0
    },
    setPermit (node, status) {
      node.checked = status
    },
    setParentPermit (node, checked) {
      let me = this
      if (me.selectable && node) {
        me.clearIndeterminate(node)
        me.setPermit(node, checked = checked || isChecked(node))
        me.setParentPermit(node.parent, checked)
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
    changeChecked (node) {
      this.uncheck(node, () => {
        let me = this
        let checked = node.checked
        let isIndeterminate = me.isIndeterminate(node)

        checked = !(checked || isIndeterminate)

        /**
           * 设置当前节点的选中状态
           * 删除半选状态， 在页面执行 draw() 的时候会重新计算
           * */
        me.setPermit(node, checked)
        me.setCheckedCache(node, checked)
        me.clearIndeterminate(node)

        /* 批量设置下级节点的选中状态并 */
        posterity(node.children, (node) => {
          me.setPermit(node, checked)
          me.setCheckedCache(node, checked)
          me.clearIndeterminate(node)
        })

        me.setParentPermit(node.parent)
        me.setTopChecked()

        /* 执行回调函数 */
        fire(me.checked, node)

        me.update(!1)
      })
    },
    clear (callback) {
      this.cache = {}
      this.list = []
      this.active = {}
      this.indexList = []
      this.blockList = []
      this.scrollTop = 0
      this.currentPage = 1
      this.totalSize = 0
      this.searchValue('')
      this.selectable && (this.checkedCache = [])
      fire(callback)
    },
    delNode (id, jtype = _PARENT_) {
      if (isArray(id)) {
        each(id, (_id_) => {
          this.delNode(_id_, jtype)
        })
      } else {
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
          delFromIndex(this.indexList, node)

          if (children) {
            for (let i = children.length - 1; i >= 0; i--) {
              this.delNode(children[i], children[i].jtype, !1)
            }
          }

          if (this.selectable && node.checked) {
            this.setCheckedCache(node)
          }

          this.removeCacheNode(node)
          this.update()
        }
      }
    },
    init (arg = {}, callback) {
      let me = this
      let { init, initAfter } = me.ajax || {}
      let initNode = (list, jtype, flag) => {
        each(list, (obj) => {
          if (flag) {
            initNode(obj.children, jtype, flag)
          } else {
            let attr = {
              deep: 0,
              jtype: obj.jtype || jtype
            }
            if (this.selectable) {
              attr.checked = !1
            }
            if (attr.jtype !== _CHILD_) {
              attr.open = !!obj.open
              attr.children = []

              if (this.ajax && this.ajax.open) {
                attr.ajaxed = !!obj.ajaxed
                attr.ajaxing = !1
              }
            }
            extend(obj, attr)
          }
          this.cacheNode(obj, obj.jtype)
        })
        if (!flag) {
          return array2tree(list).list
        }
        return list
      }
      let ajaxEvent = () => {
        return init({
          sort: this.sort,
          pageSize: this.pageSize,
          currentPage: this.currentPage,
          search: this.search
        }).then((data) => {
          me.totalSize = data.totalSize
          return splice(me.list, initNode(data.list, _PARENT_))
        })
      }
      let staticEvent = () => {
        return new Promise((resolve) => {
          setTimeout(() => {
            let start = (me.currentPage - 1) * me.pageSize
            let list = (me.data = me.data || {
              list: Array.from(me.list),
              totalSize: me.list.length
            }).list
            if (me.search) {
              list = me.getPosterity(list, (node) => {
                for (let i in me.column) {
                  let col = me.column[i]
                  let result = !1
                  if (col.data) {
                    result = col.data(node).indexOf(me.search) >= 0
                  } else {
                    result = col.id && node[col.id] && isChar(node[col.id]) && node[col.id].indexOf(me.search) >= 0
                  }
                  if (result) {
                    return result
                  }
                }
              }).list
              me.totalSize = list.length
            } else {
              me.totalSize = me.data.totalSize
            }
            list = list.slice(start, start + me.pageSize)
            resolve(splice(me.list, initNode(list, _PARENT_, list.length > 0 && isDefined(list[0].deep))))
          }, 200)
        })
      }

      extend(me, arg)
      me.startA(() => {
        (init ? ajaxEvent : staticEvent)().then(() => {
          me.setDefActive()
          me.initIndex(me.list, 0, !0, !0)
          fire.call(me, initAfter)
          fire.call(me, callback)
        }).then(() => {
          if (me.selectable) {
            let cache = me.cache
            let checkedCache = me.checkedCache
            me.topChecked = !1
            posterity(me.list, (node) => {
              checkedCache[node.id + node.jtype] && (node.checked = me.topChecked = !0)
            })

            if (me.ajax && me.ajax.open) {
              each(cache, (node) => {
                if (node.jtype === _CHILD_) {
                  let isChecked = checkedCache[node.id + node.jtype]
                  let parent = me.cacheParent(node.parent.id)
                  if (isChecked) {
                    node.checked = !0
                  }
                  if (parent) {
                    parent.children.push(node)
                  }
                }
              })
            }
          }
        }).then(() => {
          me.closeA(() => {
            me.searchValue(me.search)
            me.update(arg.top0 ? me.scrollTop = 0 : me.scrollTop, 0)
          })
        })
      })
    },
    initIndex (array, deep, isOpen, delFlag, callback) {
      this.initIndexPrototype(
        this.indexList,
        array, deep, isOpen, delFlag
      )
      fire(callback)
    },
    initIndexPrototype (list, array, deep, isOpen, delFlag) {
      delFlag && list.splice(0, list.length)
      each(array, (obj) => {
        let children = obj.children
        obj.deep = deep
        isOpen && list.push(obj)
        if (children) {
          this.initIndexPrototype(list, children, deep + 1, isOpen && obj.open)
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
        let handle = (list) => {
          splice(node.children, map(list, (obj) => {
            let tpl = {
              pId: node.id,
              deep: node.deep + 1,
              jtype: _CHILD_,
              parent: node
            }
            if (me.selectable) {
              tpl.checked = node.checked
            }
            return initNode(obj, tpl)
          }))
          return node
        }

        node.ajaxed = !0
        node.ajaxing = !0

        me.clearIndeterminate(node)
        me.draw()

        return ajax.then((r) => {
          if (r.length > 0) {
            me.setParentPermit(handle(r))
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
        return new Promise((resolve) => {
          resolve(!0)
        })
      }
      let findList = (list, result = []) => {
        each(list, (node) => {
          result.push(node)
          if (node.open) {
            findList(node.children, result)
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
      ) ? ajaxEvent : staticEvent)().then((flag) => {
        let indexList = me.indexList
        let openList = findList(node.children)
        let length = openList.length

        if (node.open) {
          splice(indexList, 0, node.j + 1, length)
        } else {
          splice(indexList, openList, node.j + 1)
        }
        node.open = !node.open

        if (!flag && me.selectable && node.checked) {
          each(node.children, (child) => {
            me.setCheckedCache(child, !0)
          })
        }

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
    searchEvent (e) {
      let me = this, search

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
        setTimeout(() => {
          me.init({
            search,
            currentPage: 1
          })
        }, 300)
      })
    },
    resizeColumn () {
      let { colVis } = this
      let isMenu = $('.iod-service,.iod-dict').length > 0
      let isEc = $('.ui-center>.ui-center-content>.ec:first').length > 0
      let dw = $(window).width()
      let ow = 82
      if (isEc) {
        ow = 352
      } else if (isMenu) {
        ow = ((dw - 82) / 8) + 122
      }
      let tw = dw - ow
      let aw = 0
      let rw = 0

      each(colVis, (col) => {
        if (isNumber(col[1])) {
          aw += col[1]
        } else {
          aw = '100%'
          return !1
        }
      })

      if (isNumber(aw)) {
        if (aw <= tw) {
          each(colVis, (col) => {
            let cw = parseInt((col[1] * tw / aw).toFixed())
            rw += cw
            col.splice(1, 1, cw)
          })
          colVis[0].splice(1, 1, colVis[0][1] - rw + tw - 1)
        }
      }
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
    scrollTo (top, duration) {
      return this.$refs.opt.scrollTo(0, isUndefined(top) ? this.scrollTop : top, duration)
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
      return (this.ajax && this.ajax.open && node.ajaxed === !1) ? !1 : (!node.children || !node.children.length)
    },
    cssArrows (node) {
      return node.open ? 'el-icon-arrow-down' : 'el-icon-arrow-right'
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
    getCheckboxClass (node) {
      let me = this, name = []
      let isIndeterminate = node ? me.isIndeterminate(node) : me.isTopIndeterminate()
      if (isIndeterminate) {
        name = ['is-indeterminate']
      } else if (node ? node.checked : me.topChecked) {
        name = ['is-checked']
      }
      if (node) {
        this.uncheck(node, noop, () => name.push('is-disabled'))
      }
      return name.join(' ')
    },
    scrollHeight () {
      let nodeHeight = this.nodeHeight
      let length = this.indexList.length
      return {
        sH: (length + (length > this.step ? 3 : 2)) * nodeHeight
      }
    },
    sizeChange (size) {
      this.init({ currentPage: 1, pageSize: size })
    },
    currentChange (num) {
      if (this.currentPage !== num) {
        this.init({
          currentPage: num
        })
      }
    },
    hasSort (sort) {
      return isDefined(sort)
    },
    sortEvent (col) {
      let cols = this.column
      let sort = col.sort

      each(cols, (_col_) => {
        if (_col_ !== col) {
          if (isDefined(_col_.sort)) {
            _col_.sort = ''
          }
        }
      })

      switch (sort) {
        case 'asc' : {
          col.sort = 'desc'
          break
        }
        case 'desc' : {
          col.sort = ''
          break
        }
        default : {
          col.sort = 'asc'
          break
        }
      }

      if (col.sort) {
        this.sort = [col.id, col.sort]
      } else {
        this.sort = undefined
      }

      this.init()
    },
    sort2class (sort) {
      switch (sort) {
        case 'asc': {
          return 'ascending'
        }
        case 'desc': {
          return 'descending'
        }
      }
      return ''
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
      let { step, nodeHeight, indexList, blockList, currentPage, pageSize } = this
      let scrollTop = isDefined(top) ? (this.scrollTop = top) : this.scrollTop
      let index = ~~Math.round(scrollTop / nodeHeight)

      splice(
        blockList,
        each(indexList.slice(index, index + step + 1), (node) => {
          node.j = index
          node.i = (currentPage - 1) * pageSize + ++index
        })
      )

      this.update(!1)
    }
  },
  computed: {
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
    }
  },
  created () {
    this.cache = {}
    this.indexList = []
    this.blockList = []
    this.selectable && (this.checkedCache = [])
  },
  mounted () {
    let callback
    const {
      jid, autoInit, autoStep, TimerName,
      init, resizeEvent, resizeColumn
    } = this
    const $win = $(window)

    const timer = (T) => {
      return Timer(TimerName, resizeEvent, T)
    }

    this.cache = {}

    if (autoStep !== !1) {
      callback = () => timer(200)
      $win.bind('resize.' + jid, () => timer(25))
    }

    if (autoInit !== !1) {
      init({}, callback)
    }

    resizeColumn()
  },
  directives: {
    clickoutside,
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
          extend(data, {
            left: e.target.offsetLeft,
            x: e.pageX
          })

          window.addEventListener('mousemove', move)
          window.addEventListener('mouseup', up)
        })
      }
    }
  }
}
</script>
<style lang="less">
  .add-info {
    margin-left: calc(~'50% - 70px');
    text-align: center;
    cursor: pointer;
    color: #888;
    font-size: 14px;

    div {
      margin-top: 10px;
    }

    a {
      font-size: 12px;
      color: #4cb1ff;

      &:hover {
        color: #00a2ff;

        i {
          color: #00a2ff;
        }
      }

      i {
        font-size: 12px;
        font-weight: 900;
        color: #4cb1ff;
        margin-left: 10px;
      }
    }

    > i {
      margin-left: 21px;
    }

    .ico-tip {
      position: relative;
      top: 3px;
      margin-right: 6px;
      font-weight: 900;
    }
  }

  .tc {
    .caret-wrapper {
      position: absolute;
      top: 5px;
      cursor: pointer;
      margin-left: 5px;
      width: 16px;
      height: 30px;

      &.ascending .ascending {
        border-bottom-color: #48576a;
      }
      &.descending .descending {
        border-top-color: #48576a;
      }
    }

    .el-checkbox .caret-wrapper {
      top: -6px;
    }

    .el-checkbox {
      display: inline;

      .el-checkbox__input {
        top: 0;
      }
    }

    .sort-caret {
      display: inline-block;
      width: 0;
      height: 0;
      border: 0;
      content: "";
      position: absolute;
      left: 3px;
      z-index: 2;

      &.ascending,
      &.descending {
        border-right: 5px solid transparent;
        border-left: 5px solid transparent;
      }

      &.ascending {
        top: 9px;
        border-top: none;
        border-bottom: 5px solid #97a8be;
      }

      &.descending {
        bottom: 9px;
        border-top: 5px solid #97a8be;
        border-bottom: none;
      }
    }

    .el-checkbox__input.is-disabled + .el-checkbox__label {
      color: #1f2d3d;
    }
  }
</style>
