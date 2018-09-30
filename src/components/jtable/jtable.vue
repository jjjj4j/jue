<template>
  <div class="tc">
    <div class="toolbar">
      <slot name="btns"></slot>
      <div class="search" :class="{'has-filter': filter}">
        <form @submit.prevent="searchEvent">
          <div>
            <input type="search"/>
            <el-tooltip ref="tooltip"
                        effect="light"
                        placement="top-end"
                        :content="getSearchTip()"
                        @input="hackIE9">
              <a @click="searchEvent"><span class="el-icon-search"></span></a>
            </el-tooltip>
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
        <div @mousewheel.stop.prevent="wheelEvent" class='jb-c' v-loading="loading">
          <table :width="tableWidth" v-if="blockList.length > 0">
            <colgroup>
              <col :width="col[1]" v-for='col in colVis'>
            </colgroup>
            <tbody class="no-line">
            <tr v-for='(node, index) in blockList'>
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
        </div>
      </div>
      <div @scroll="scrollEvent" class='js'>
        <div :style="scrollHeight()"></div>
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
  import Clickoutside from '../clickoutside'

  let _PARENT_ = 'parent'
  let _FOLDER_ = 'folder'
  let _CHILD_ = 'child'

  let posterity = (list, callback, isRecursive = !0) => {
    $.for(list, (node) => {
      callback(node)
      if (isRecursive && node.children) {
        posterity(node.children, callback, isRecursive)
      }
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

  let isChecked = (node) => {
    let validate = (list) => {
      for (let i in list) {
        let item = list[i]
        if (item.checked) {
          return !0
        }
        let children = item.children
        if (children && children.length > 0) {
          if (validate(children)) {
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

      me.list = list || []
      me.currentPage = 1
      me.pageSize = 10
      me.totalSize = 0
      me.nodeHeight = 40
      me.step = step || 10
      me.autoStep = !step

      $.extend(me, {
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
        if (!$.isUndefined(status)) {
          return status
        }
        return node['isIndeterminate'] = this.getCheckedNum(node) === !0
      },
      clearIndeterminate (node) {
        if (this.selectable && node.jtype !== _CHILD_) {
          delete node['isIndeterminate']
        }
      },
      isTopIndeterminate () {
        return this.getCheckedNum({children: this.indexList}) === !0
      },
      setTopChecked () {
        this.topChecked = isChecked({children: this.indexList})
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
          $.for(cache, (node) => {
            node.checked = !1
            delete cache[node.id + node.jtype]
          })
          $.splice(cache)
        }
      },
      uncheck (node, fail, success) {
        let column, uncheck
        $.for(this.column, (col) => {
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
          $.fire(me.checked, node)

          me.$forceUpdate()
        })
      },
      clear (callback) {
        $('input[type=search]', this.$el.children[0]).val('')
        this.cache = {}
        this.list = []
        this.active = {}
        this.indexList = []
        this.blockList = []
        this.scrollTop = 0
        this.currentPage = 1
        this.totalSize = 0
        this.search = ''
        if (this.selectable) {
          this.checkedCache = []
        }
        $.fire(callback)
      },
      delNode (id, jtype = _PARENT_) {
        if ($.isArray(id)) {
          $.for(id, (_id_) => {
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
          }
        }
      },
      init (arg = {}) {
        let me = this
        let {init, initAfter} = me.ajax || {}
        let initNode = (list, jtype, flag) => {
          $.for(list, (obj) => {
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
              $.extend(obj, attr)
            }
            this.cacheNode(obj, obj.jtype)
          })
          if (!flag) {
            return $.array2tree(list)
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
            return $.splice(me.list, initNode(data.list, _PARENT_))
          })
        }
        let staticEvent = () => {
          return new Promise((resolve, reject) => {
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
                      result = col.id && node[col.id] && $.isStr(node[col.id]) && node[col.id].indexOf(me.search) >= 0
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
              resolve($.splice(me.list, initNode(list, _PARENT_, list.length > 0 && !$.isUndefined(list[0].deep))))
            }, 200)
          })
        }

        $.extend(me, arg)
        me.startA(() => {
          (init ? ajaxEvent : staticEvent)().then(() => {
            me.setDefActive()
            me.initIndex(me.list, 0, !0, !0)
            $.fire.call(me, initAfter)
          }).then(() => {
            if (me.selectable) {
              let cache = me.cache
              let checkedCache = me.checkedCache
              me.topChecked = !1
              posterity(me.list, (node) => {
                checkedCache[node.id + node.jtype] && (node.checked = me.topChecked = !0)
              })

              if (me.ajax && me.ajax.open) {
                $.for(cache, (node) => {
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
              $('input[type=search]', me.$el.children[0]).val(me.search)
              if (me.scrollTop === 0) {
                me.draw()
              } else if (arg.top0 === !1) {
                me.draw()
              } else {
                me.setScrollTop(0)
              }
            })
          })
        })
      },
      initIndex (array, deep, isOpen, delFlag, callback) {
        this.initIndexPrototype(
            this.indexList,
            array, deep, isOpen, delFlag
        )
        if (callback) {
          callback()
        }
      },
      initIndexPrototype (list, array, deep, isOpen, delFlag) {
        delFlag && list.splice(0, list.length)
        $.each(array, (i, obj) => {
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
            child = $.extend(node, tpl)
            me.cacheChild(child)
          }
          return child
        }
        let ajaxEvent = () => {
          let promise = me.ajax.open(node), ajax = promise
          let handle = (list) => {
            $.splice(node.children, list.map((obj) => {
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
          return new Promise((resolve, reject) => {
            resolve(!0)
          })
        }
        let findList = (list, result = []) => {
          $.for(list, (node) => {
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
            !node.open && !$.isUndefined(node.open) &&
            !node.ajaxed && !$.isUndefined(node.ajaxed) &&
            !me.isSearch()
        ) ? ajaxEvent : staticEvent)().then((flag) => {
          let indexList = me.indexList
          let openList = findList(node.children)
          let length = openList.length

          if (node.open) {
            $.splice(indexList, 0, node.j + 1, length)
          } else {
            $.splice(indexList, openList, node.j + 1)
          }
          node.open = !node.open

          if (!flag && me.selectable && node.checked) {
            $.for(node.children, (child) => {
              me.setCheckedCache(child, !0)
            })
          }

          me.draw()
        })
      },
      searchEvent (e, scrollTop) {
        let me = this, search

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
          setTimeout(() => {
            me.init({
              search,
              currentPage: 1
            })
          }, 300)
        })
      },
      wheelEvent (e) {
        this.setScrollTop(-e.wheelDelta, !0)
      },
      scrollEvent (e) {
        $.timer('scrollEvent', () => {
          this.scrollTop = e.target.scrollTop
          this.draw()
        }, 10)
      },
      setScrollTop (top, delta) {
        let $js = this.$el.children[1].children[1]
        top = $.isUndefined(top) ? this.scrollTop : top
        $js.scrollTop = top + (delta ? $js.scrollTop : 0)
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
      getCheckboxClass (node) {
        let me = this, name = []
        let isIndeterminate = node ? me.isIndeterminate(node) : me.isTopIndeterminate()
        if (isIndeterminate) {
          name = ['is-indeterminate']
        } else if (node ? node.checked : me.topChecked) {
          name = ['is-checked']
        }
        if (node) {
          this.uncheck(node, $.noop, () => {
            name.push('is-disabled')
          })
        }
        return name.join(' ')
      },
      scrollHeight () {
        let nodeHeight = this.nodeHeight
        let length = this.indexList.length
        return {
          height: (length + (length > this.step ? 3 : 2)) * nodeHeight + 'px'
        }
      },
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
      sizeChange (size) {
        this.init({
          currentPage: 1,
          pageSize: size
        })
      },
      currentChange (num) {
        if (this.currentPage !== num) {
          this.init({
            currentPage: num
          })
        }
      },
      hasSort (sort) {
        return !$.isUndefined(sort)
      },
      sortEvent (col) {
        let cols = this.column
        let sort = col.sort

        $.for(cols, (_col_) => {
          if (_col_ !== col) {
            if (!$.isUndefined(_col_.sort)) {
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
          default: {
            return ''
          }
        }
      },
      hackIE9: $.hack.tooltips,
      draw () {
        let step = this.step
        let nodeHeight = this.nodeHeight
        let indexList = this.indexList
        let scrollTop = this.scrollTop
        let index = ~~Math.round(scrollTop / nodeHeight)

        $.splice(
            this.blockList,
            $.for(indexList.slice(index, index + step + 1), (node) => {
              node.j = index
              node.i = (this.currentPage - 1) * this.pageSize + ++index
            })
        )

        this.$forceUpdate()
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
      }
    },
    created () {
      this.cache = {}
      this.indexList = []
      this.blockList = []
      if (this.selectable) {
        this.checkedCache = []
      }
    },
    mounted () {
      let me = this
      let $win = $(window)

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

      let isMenu = $('.iod-service,.iod-dict').length > 0
      let isEc = $('.ui-center>.ui-center-content>.ec:first').length > 0
      let dw = $win.width()
      let ow = 82
      if (isEc) {
        ow = 352
      } else if (isMenu) {
        ow = ((dw - 82) / 8) + 122
      }
      let tw = dw - ow
      let aw = 0
      let rw = 0

      $.map(me.colVis, (col) => {
        if ($.isNumeric(col[1])) {
          aw += col[1]
        } else {
          aw = '100%'
          return !1
        }
      })

      if ($.isNumeric(aw)) {
        if (aw <= tw) {
          $.map(me.colVis, (col) => {
            let cw = $.int((col[1] * tw / aw).toFixed())
            rw += cw
            col.splice(1, 1, cw)
          })
          me.colVis[0].splice(1, 1, me.colVis[0][1] - rw + tw - 1)
        }
      }
    },
    directives: {
      Clickoutside,
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
