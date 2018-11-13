<template>
  <div class="edit-table"
       :style="{
          width,
          height: tableHeight
        }">
    <div class="jt" :class="pageClass">
      <optiscroll ref="opt" class='jb' :vBlank="44" @scroll="scrollEvent">
        <fix-block slot="header">
          <div class='jb-h'>
            <table :width="tableWidth">
              <colgroup>
                <col :width="col[1]" v-for='col in colVis'>
              </colgroup>
              <thead>
              <tr>
                <th v-for='col in colVis'>
                  <span class="ellipsis" :class="{'text-right': column[col[0]].btnCol}">{{column[col[0]].name}}</span>
                  <el-tooltip ref="tooltip"
                              effect="light"
                              placement="top"
                              :content="column[col[0]].help"
                              @input="hackIE9"
                              v-if="column[col[0]].help">
                    <el-button class="btn-help" size="mini">?</el-button>
                  </el-tooltip>
                  <div class="drag"
                       v-if="column[col[0]].drag !== !1 && !column[col[0]].btnCol"
                       v-drag="col"></div>
                </th>
              </tr>
              </thead>
            </table>
          </div>
        </fix-block>
        <div class='jb-c'>
          <table :width="tableWidth" v-if="list.length > 0">
            <colgroup>
              <col :width="col[1]" v-for='col in colVis'>
            </colgroup>
            <tr>
              <th v-for='col in colVis'></th>
            </tr>
            <tbody class="no-line">
            <tr v-for='node in blockList'>
              <td v-for='col in colVis' :class="'col-'+column[col[0]].id">
                <div class="edit" v-if="column[col[0]].btnCol">
                  <slot name="btnCol" :node="node">
                    <el-button type="primary" size="mini" icon="delete2" @click="delNode(node)"></el-button>
                  </slot>
                </div>
                <div v-else-if="column[col[0]].type === 'text'">
                  <el-form-item errorType="tooltip"
                                :prop="prefix + '.' + (node.i - 1)  + '.' + column[col[0]].id"
                                :rules="column[col[0]].rule">
                    <el-input v-model="node[column[col[0]].id]"
                              :disabled="column[col[0]].disabled && column[col[0]].disabled(node)"></el-input>
                  </el-form-item>
                </div>
                <div v-else-if="column[col[0]].type === 'time'">
                  <el-form-item errorType="tooltip"
                                :prop="prefix + '.' + (node.i - 1)  + '.' + column[col[0]].id"
                                :rules="column[col[0]].rule">
                    <el-time-picker
                        is-range
                        v-model="node[column[col[0]].id]"
                        range-separator="至"
                        start-placeholder="开始时间"
                        end-placeholder="结束时间"
                        placeholder="选择时间范围">
                    </el-time-picker>
                  </el-form-item>
                </div>
                <div v-else-if="column[col[0]].type === 'select'">
                  <el-form-item errorType="tooltip"
                                :prop="prefix + '.' + (node.i - 1) + '.' + column[col[0]].id"
                                :rules="column[col[0]].rule">
                    <el-select @change="column[col[0]].change && column[col[0]].change(node, $event, list)"
                               :disabled="column[col[0]].disabled && column[col[0]].disabled(node)"
                               v-model="node[column[col[0]].id]">
                      <el-option
                          v-for="item in options(column[col[0]].init(node))"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </div>
                <div v-else-if="column[col[0]].type === 'select-tree'">
                  <el-form-item errorType="tooltip"
                                :prop="prefix + '.' + (node.i - 1) + '.' + column[col[0]].id"
                                :rules="column[col[0]].rule">
                    <el-select-tree :list="options(column[col[0]].init(node))"
                                    :disabled="column[col[0]].disabled && column[col[0]].disabled(node)"
                                    @change="column[col[0]].change && column[col[0]].change(node, $event, list)"
                                    v-model="node[column[col[0]].id]"></el-select-tree>
                  </el-form-item>
                </div>
                <div v-else-if="column[col[0]].type === 'checkbox'">
                  <el-form-item>
                    <el-checkbox v-model="node[column[col[0]].id]"
                                 @change="column[col[0]].change && column[col[0]].change(node, $event, list)"></el-checkbox>
                  </el-form-item>
                </div>
                <div class="ellipsis"
                     v-else-if="column[col[0]].data"
                     v-html="column[col[0]].data(node)"></div>
                <div class="ellipsis static-text" v-else>{{node[column[col[0]].id]}}</div>
              </td>
            </tr>
            </tbody>
          </table>
          <table :width="tableWidth" v-else>
            <tbody>
            <tr>
              <td></td>
            </tr>
            <tr>
              <td style="height:70px;line-height:70px;text-align:center;">没有添加数据</td>
            </tr>
            </tbody>
          </table>
        </div>
      </optiscroll>
    </div>
    <el-pagination
        layout="total, sizes, prev, pager, next, jumper"
        :current-page="currentPage"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="pageSize"
        :total="totalSize"
        @size-change="sizeChange"
        @current-change="currentChange"
        v-if="isPage">
    </el-pagination>
    <div class="addBtn">
      <el-button type="primary" icon="plus" @click="$addEvent"></el-button>
    </div>
  </div>
</template>

<script>
import { extend, fire, parseInt, isDefined, isNumber, isPlainObject, isUndefined } from '@/util/core'
import { each, map } from '@/util/array'
import { increment } from '@/util/form'
import { json2str } from '@/util/json'
import { tooltips } from '@/util/hack'
import FixBlock from '@/components/optiscroll/fix'

let cache = {}
export default {
  name: 'editTable',
  components: { FixBlock },
  data: function () {
    let me = this
    let {
      autoInit,
      width,
      height,
      prefix,
      column,
      ajax,
      colVis,
      addEvent
    } = me.setting
    return {
      top: 0,
      nodeHeight: 41,
      indexList: [],
      autoInit,
      width: width || '100%',
      height: height,
      prefix,
      column,
      ajax,
      colVis,
      addEvent,
      currentPage: 1,
      pageSize: 10
    }
  },
  props: {
    list: {
      type: Array,
      default () { return [] }
    },
    setting: Object
  },
  computed: {
    isPage () {
      return this.list.length > 100
    },
    pageClass () {
      if (this.isPage) {
        return 'is-page'
      }
    },
    tableHeight () {
      let { height, isPage, nodeHeight, totalSize } = this
      if (height) {
        return height
      } else if (isPage) {
        return '489px'
      } else {
        if (totalSize) {
          if (totalSize > 10) {
            return '441px'
          }
          return (totalSize + 1) * nodeHeight + 1 + 'px'
        }
        return '112px'
      }
    },
    totalSize () {
      return this.list.length
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
      return isNumber(width) ? width : '100%'
    },
    blockList () {
      if (this.isPage) {
        let { currentPage, pageSize, list } = this
        let start = ((currentPage || 1) - 1) * (pageSize || 10)
        let end = start + (pageSize || 10)
        return each(list.slice(start, end), (obj, i) => {
          obj.i = start + i + 1
        })
      }
      return each(this.list, (obj, i) => {
        obj.i = i + 1
      })
    }
  },
  methods: {
    hackIE9: tooltips,
    getList () {
      return this.list
    },
    init (callback) {
      let ajax = this.ajax
      let hasInitAjax = ajax && ajax.init
      let ajaxAfter = ajax && ajax.initAfter
      let formatData = (list) => {
        return each(list, (obj) => this.cacheNode(obj))
      }
      let initAjax = () => {
        ajax.init().then((data) => {
          this.loading = !1
          this.list = formatData(data.list)
          setTimeout(() => {
            fire(ajaxAfter)
            fire(callback)
            this.setScrollTop(this.$el.children[0].children[1].scrollTop = 0)
          }, 250)
        })
      }
      if (hasInitAjax) {
        this.loading = !0
        initAjax()
      }
    },
    cacheNode (node) {
      return isPlainObject(node) ? (this.cache[node.id] = node) : this.cache[node]
    },
    addNode (node) {
      let cache
      let tplNode

      if (node) {
        cache = this.cacheNode(node.id)
        if (cache) {
          return extend(cache, node)
        }
        if (node.target) {
          tplNode = {}
        } else {
          tplNode = node
        }
      } else {
        tplNode = {}
      }

      if (!tplNode.id) {
        let column = this.column
        let length = this.list.length
        let lastNode = {}
        if (length > 0) {
          lastNode = this.list[length - 1]
        }
        $.each(column, (i, col) => {
          let id = col.id
          if (isDefined(id)) {
            if (isUndefined(tplNode[id])) {
              if (col.type === 'checkbox') {
                tplNode[id] = !1
              } else if (col.type === 'text') {
                tplNode[id] = col.increment ? col.increment(lastNode[id], id, lastNode) : increment(lastNode[id])
              } else {
                tplNode[id] = col.increment ? col.increment(lastNode[id], id, lastNode) : lastNode[id]
              }
            }
          }
        })
      } else {
        this.cacheNode(tplNode)
      }
      this.list.push(tplNode)
    },
    delNode (node) {
      let index = this.list.indexOf(node)
      if (index >= 0) {
        this.list.splice(index, 1)
      }
      delete cache[node.id]
    },
    $addEvent (e) {
      this.$nextTick(() => {
        setTimeout(() => {
          if (this.isPage) {
            this.currentPage = -(Math.floor(-(this.totalSize / this.pageSize)))
          } else {
            $(this.$el.children[0].children[1]).scrollTop(this.list.length * 40 + 40)
          }
        }, 100)
      })
      return (this.addEvent || this.addNode)(e)
    },
    sizeChange (size) {
      extend(this, {
        currentPage: 1,
        pageSize: size
      })
    },
    currentChange (num) {
      if (this.currentPage !== num) {
        this.currentPage = num
      }
    },
    options (attr) {
      if (!attr) {
        return []
      }
      if (attr.length === 1) {
        return attr[0]
      }

      let [
        name, param,
        callback = () => {},
        filter = () => true
      ] = attr
      let me = this
      let key = name + json2str(param)
      let list = cache[key]

      if (list) {
        return list.filter(filter)
      } else if (cache[key] === !1) {
        return []
      } else {
        cache[key] = !1
        Service[name](param).then((r) => {
          callback(r.data.list)
          cache[key] = map(r.data.list, (obj) => {
            return {
              value: obj.id,
              label: obj.name
            }
          })
          me.ajaxKey.push(key)
          me.$forceUpdate()
        }).catch(() => {
          cache[key] = null
          me.options(attr)
        })
      }
    },
    scrollEvent (e) {
    },
    setScrollTop (top, delta) {
      let $js = this.$el.children[0].children[0].children[1]
      let $jsTop = parseInt($js.style.top)

      top = isUndefined(top) ? 0 : top
      $js.style.top = (delta ? $jsTop - top : -top) + 'px'
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
  created () {
    this.cache = {}
    this.ajaxKey = []
  },
  mounted () {
    if (this.autoInit !== !1) {
      this.init()
    }
  },
  destroyed () {
    each(this.ajaxKey, (key) => {
      delete cache[key]
    })
  }
}
</script>
<style lang="less">
  .edit-table {
    position: relative;

    .static-text {
      color: #1f2d3d;
      font-size: 14px;
    }

    .jb {
      .jb-h {
        position: absolute;
        background: #eff2f7;
        z-index: 1031;

        .btn-help {
          float: right;
          padding: 2px 5px;
          margin: 10px 5px;
          border-radius: 15px;
          color: #fff;
          background: #8bacbc;
          border: 0 solid #eee !important;
        }
      }
    }

    .jt {
      height: 100%;

      &.is-page {
        height: calc(~'100% - 48px')!important;
      }
      .jb-c {
        position: absolute;
      }
    }

    .jb-c {
      .el-form-item {
        margin: 0 -10px;
        input {
          border: 0;
        }
      }
      .el-form-item__content {
        margin-left: 0 !important;
        line-height: 35px;
      }
      .el-select, .el-input, .el-checkbox {
        width: 100% !important;
      }
      .el-checkbox {
        margin-right: 0;
        padding-left: calc(~'50% - 8px');
      }
      .is-disabled {
        input {
          border-radius: 0;
          background-color: #fff;
        }
      }
    }

    .el-pagination {
      height: 48px;
      padding: 20px 0 0 0;
      text-align: center;

      .el-pagination__total,
      .el-pagination__sizes {
        float: left;
      }
      .el-pagination__jump {
        float: right;
      }

      .el-input {
        width: 100px !important;
      }
    }

    .addBtn {
      position: absolute;
      right: -55px;
      bottom: 0;

      button {
        padding: 10px;
      }
    }

    .jt table tbody tr:hover input {
      background-color: #eee;
    }
  }
</style>
