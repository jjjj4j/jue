<template>
  <div class="res-group">
    <jtree
        ref="jtree"
        :setting="jeConfig"></jtree>
    <jtable
        ref="jtable"
        :setting="jtConfig">
      <div class="btns" slot="btns">
        <div class="info-area">
          <div class="first-line">
            分组名称：<span class="highlight">{{root.name}}</span>
            <el-button style="margin-left: 20px" type="primary" size="mini" icon="el-icon-edit-outline"
                       @click="editEvent(root)"
                       v-if="!!root.id"></el-button>
            <el-button style="margin-left: 5px" type="primary" size="mini" icon="el-icon-delete"
                       @click="delEvent(root)"
                       v-if="!!root.id"></el-button>
          </div>
          <div class="second-line">
            <p class="item orgCode">行政区划：{{root.areaCode}}</p>
            <p class="item level">唯一标识：{{root.code}}</p>
            <p class="item description" :title="root.description">描述：<span>{{root.description}}</span></p></div>
        </div>
        <div class="org-btns">
          <el-button type="primary" size="small" @click="addEvent">添加</el-button>
          <el-dropdown @command="handleCommand" trigger="click">
            <el-button type="primary" size='small'>
              批量<i class="el-icon-caret-bottom el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="importExcel">导入</el-dropdown-item>
              <el-dropdown-item command="exportExcel" v-if="!!root.id">导出</el-dropdown-item>
              <el-dropdown-item command="delListEvent" v-if="!!root.id">删除</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </div>
      <template slot="btnCol" slot-scope="{node}">
        <div class="edit">
          <el-button type="primary" size="mini" icon="edit" title="编辑"
                     @click="editEvent(node)"></el-button>
          <el-button type="primary" size="mini" icon="delete2" title="删除"
                     @click="delEvent(node)"></el-button>
        </div>
      </template>
    </jtable>
    <edit-form ref="dialog" :title="title"></edit-form>
    <upload-dialog ref="upload" :success="uploadEvent"></upload-dialog>
  </div>
</template>

<script>
import EditForm from './dialog'
import Mixin from '../mixin'
import { initGroupTree, tmp } from '@/util/storage'
import { extend } from '@/util/core'
import { each } from '@/util/array'

export default {
  name: 'group',
  mixins: [Mixin],
  components: { EditForm },
  data () {
    let me = this
    return {
      title: '',
      root: {},
      jeConfig: {
        autoInit: !1,
        width: '100%',
        list: tmp('group'),
        search: tmp('group-search'),
        scrollTop: tmp('group-top'),
        searchTop: tmp('group-search-top'),
        active: tmp('group-active'),
        icon: {
          root: 'ico ico-root',
          parent: 'ico ico-folder'
        },
        click (node) {
          me.jtree.setActive(node)
          me.jtable.clear()
          me.jtable.init()
          me.root = node
        }
      },
      jtConfig: {
        autoInit: !1,
        selectable: !0,
        column: [
          {
            'id': 'i',
            'name': '序号',
            'drag': !1
          },
          {
            'id': 'name',
            'name': '名称',
            'keyCol': !0
          },
          {
            'id': 'areaCode',
            'name': '行政区划'
          },
          {
            'id': 'code',
            'name': '唯一标识'
          },
          {
            'id': 'description',
            'name': '备注'
          },
          {
            'name': '操作',
            'btnCol': !0
          }
        ],
        icon: {
          root: 'el-icon-setting',
          parent: 'el-icon-menu'
        },
        colVis: [[0, 80], [1, 200, !0], [2, 150], [3, 200], [4, 150], [5, 120]],
        ajax: {
          init (pageInfo) {
            let group = me.jtree.getActive()
            let param = extend(pageInfo, {
              id: group.id
            })
            return Service.pageGroup(me._p4e_ = param).then((r) => {
              return r.data
            })
          }
        }
      }
    }
  },
  computed: {
    jtree () {
      return this.$refs.jtree
    },
    jtable () {
      return this.$refs.jtable
    },
    dialog () {
      return this.$refs.dialog
    },
    upload () {
      return this.$refs.upload
    }
  },
  methods: {
    uploadEvent (r) {
      tmp('group', null)
      this.jtable.init()
      this.upload.close()
      this.$options.beforeRouteEnter[0]('', '', () => {
        this.jtree.list = $.tmp('group')
        this.jtree.init()
      })
    },
    delConfirm (event) {
      this.confirm('此操作将造成数据永久被删除, 是否继续?', event)
    },
    delAjax (list) {
      let me = this
      Service.delGroup(list).then((r) => {
        me.msg(r)
        each(list, (id) => {
          if (id === me.root.id) {
            let parent = me.root.parent
            let list = parent ? parent.children : me.jtree.list
            let index = list.indexOf(me.root)
            let clear = () => {
              if (parent) {
                next(parent)
              } else {
                me.jtable.clear()
                me.jtree.setActive(me.root = {})
              }
            }
            let next = (index) => {
              let node = index
              if ($.isNumeric(index)) {
                node = list[index]
              }
              me.jtree.setActive(node)
              me.jtable.setCheckedCache()
              me.root = node
            }
            list.length > 1 ? next(index === list.length - 1 ? 0 : index + 1) : clear()
          }
          me.jtree.delNode(id)
        })
        me.jtable.delNode(list)
        me.jtable.init()
      })
    },
    delEvent (node) {
      this.delConfirm(() => {
        this.delAjax([node.id])
      })
    },
    delListEvent () {
      let list = this.jtable.getCheckedList()
      if (list.length > 0) {
        this.delConfirm(() => {
          this.delAjax(list.map((obj) => {
            return obj.id
          }))
        })
      } else {
        this.msg('请勾选需要删除的分组')
      }
    },
    delFolderEvent () {
      let me = this
      let id = this.root.id
      me.confirm('此操作将删除本分组及以下所有空分组, 是否继续?', () => {
        Service.delEmptyGroup({ id }).then((r) => {
          initGroupTree()
          me.msg(r)
          me.$options.beforeRouteEnter[0]('', '', () => {
            me.jtree.list = tmp('group')
            me.jtree.init()
            me.jtable.init()
          })
        })
      })
    },
    addEvent () {
      this.title = '添加分组'
      this.dialog.open({
        parentId: this.root.id
      })
    },
    editEvent (obj) {
      this.title = '编辑分组'
      this.dialog.open(obj)
    },
    importExcel () {
      this.$refs.upload.open(
        this.$options.name, {}, '组织机构数据最好为三级结构，每一个分组下尽量不超过100条记录。'
      )
    },
    handleCommand (command) {
      this[command]()
    }
  },
  mounted () {
    this.jtree.init(() => {
      this.root = this.jtree.active
      this.jtable.init()
    })

    let me = this.jtable
    let jtree = this.jtree
    let $tr, $el, $div, index = [], data
    let $win = $(window)
    let $content = $('.tc', this.$el)

    let updateJtable = () => {
      let list = me.list
      if (index[0] > index[1]) {
        list.splice(data.j, 1)
        list.splice(index[1], 0, data)
        me.initIndex(list, 0, !0, !0)
      } else if (index[0] < index[1]) {
        list.splice(index[1], 0, data)
        list.splice(data.j, 1)
        me.initIndex(list, 0, !0, !0)
      }
      me.draw()
    }
    let initIndex = (list, array) => {
      each(array, (obj) => {
        let children = obj.children
        list.push(obj.id)
        if (children) {
          initIndex(list, children)
        }
      })
    }
    let success = () => {
      let list = []
      jtree.init()
      initIndex(list, jtree.list)
      Service.orderGroup(list)
    }
    let updateJtree = () => {
      let treeList = jtree.cacheParent(this.root.id).children
      let node = jtree.cacheParent(data.id)
      let diff = me.pageSize * (me.currentPage - 1)

      if (index[0] > index[1]) {
        treeList.splice(diff + data.j, 1)
        treeList.splice(diff + index[1], 0, node)
        success()
      } else if (index[0] < index[1]) {
        treeList.splice(diff + index[1], 0, node)
        treeList.splice(diff + data.j, 1)
        success()
      }
    }
    let move = (e) => {
      $div.css({
        top: e.clientY - 130,
        left: e.clientX - 300
      })
    }
    let up = () => {
      $win.off('.sort')
      $content.off('.sort')
      $div.remove()
      $tr.removeClass('sort top bottom')
      $el.removeClass('sort-active')
      updateJtree()
      updateJtable()
    }
    let enter = (e) => {
      let num, isEl20
      /* 获取当前进入的tr */
      $tr = $(e.target).closest('tr')
      /* 通过序号获取tr在列表中的序列 */
      num = parseInt($tr.find('td.i').text())
      /* 进入tr的方向依据， 并计算参照物序列 */
      isEl20 = e.offsetY < 20
      index[1] = num - (isEl20 ? 1 : 0)
      /* 删除提示线 */
      $content.find('tr').removeClass('sort top bottom')
      /* 依据进入方向，添加提示线 */
      $tr.addClass(['sort', isEl20 ? 'top' : 'bottom'].join(' '))
    }

    $content.on('mousedown', '.jb-c tr td.name a', (e) => {
      e.preventDefault()
      e.stopPropagation()
    })

    $content.on('mousedown', '.jb-c tr td:not(:last-child)', (e) => {
      e.preventDefault()
      if (!me.search) {
        let list = me.list
        /* 获取当前tr, 并添加选中样式 */
        $tr = $el = $(e.target).closest('tr').addClass('sort-active')
        /* 获取当前选中对象在列表中的序列 */
        index[1] = index[0] = parseInt($el.find('td.i').text())
        /* 通过序列获取对象 */
        data = list[index[0] - 1]
        /* 生成浮动层 */
        $div = $('<div class="drag-div">').html([data.i, data.name].join('-')).appendTo($content)
        $div.css({
          top: e.clientY - 120,
          left: e.clientX - 300
        })
        /* 绑定鼠标事件 */
        $win.on('mousemove.sort', move)
        $win.on('mouseup.sort', up)
        $content.on('mouseenter.sort', '.jb-c tr', enter)
      }
    })
  }
}
</script>

<style lang="less">
  .res-group {
    position: relative;

    .ec {
      width: 250px;
      height: 100%;
    }

    .tc {
      height: auto;
      width: auto;
      position: absolute;
      top: 20px;
      right: 20px;
      left: 290px;
      bottom: 20px;

      .jt {
        height: calc(~'100% - 114px');
      }

      .search {
        display: none;
      }

      .name.ellipsis {
        cursor: move;
      }

      .btns {
        width: 100%;
      }

      .org-btns {
        position: absolute;
        top: 23px;
        right: 0;
        width: 250px;
        text-align: right;

        .el-dropdown {
          margin-right: 5px;
        }

        .el-button {
          margin-right: 5px;
          margin-left: 0;
        }
      }
      .toolbar {
        height: 71px;
        margin-bottom: 2px;
      }
    }

    .info-area {
      width: 100%;
      padding-left: 25px;
      padding-right: 250px;
      background: #fbfbfb;
      overflow: hidden;
      border: 1px solid #eee;
      border-bottom: 1px solid #ccc;
    }

    .first-line {
      font-size: 12px;
      margin-top: 12px;
      margin-bottom: 7px;

      > button.el-button--mini {
        padding: 3px;
        font-size: 11px;
        border-radius: 2px;
      }
    }
    .second-line {
      margin: 0 0 10px 0;
    }

    .item {
      display: inline-block;
      height: 16px;
      margin: 0;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      vertical-align: top;
      font-size: 12px;

      &.orgCode {
        width: 220px;
      }

      &.level {
        width: 190px;
      }

      &.description {
        width: calc(~'100% - 470px');
      }
    }

    .highlight {
      font-size: 14px;
      color: #2D87F9;
    }

    .drag-div {
      position: absolute;
      padding: 8px 20px;
      font-size: 14px;
      border: 1px solid #aaa;
      border-radius: 3px;
      background-color: #fff;
      z-index: 1033;
    }

    .sort-active {
      background-color: #eee;
    }

    .sort {
      &.top td {
        background: url(/img/sort-top.png) repeat 0 top;
      }
      &.bottom td {
        background: url(/img/sort-bottom.png) repeat 0 bottom;
      }
    }
  }

</style>
