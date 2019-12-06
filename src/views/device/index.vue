<template>
  <div class="res-encode">
    <jtree ref="jtree" :setting="jeConfig"></jtree>
    <jtable ref="jtable" :setting="jtConfig">
      <div class="btns" slot="btns">
        <el-button type="primary" size="small" @click="addEvent">添加</el-button>
        <el-button style="margin-left: 10px" type="primary" size="small" @click="delListEvent">删除</el-button>
      </div>
      <template slot="btnCol" slot-scope="{node}">
        <div class="edit">
          <el-button type="primary" size="mini" icon="edit"
                     @click="editEvent(node)"></el-button>
          <el-button type="primary" size="mini" icon="delete2"
                     @click="delEvent(node)"></el-button>
        </div>
      </template>
    </jtable>
    <add-form ref="addDialog" title="视频编码设备添加"></add-form>
    <edit-form ref="editDialog" title="视频编码设备编辑"></edit-form>
  </div>
</template>

<script>
import AddForm from './addDialog'
import EditForm from './editDialog'
import Mixin from '../mixin'
import { tmp } from '@/util/storage'
import { tpl } from '@/util/char'
import { extend, noop } from '@/util/core'

export default {
  name: 'encoder',
  mixins: [Mixin],
  components: { AddForm, EditForm },
  data () {
    let me = this
    return {
      jeConfig: {
        autoInit: !1,
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
            'sort': '',
            'keyCol': !0
          },
          {
            'id': 'host',
            'name': 'IP地址(通道数)',
            'sort': '',
            'data': (obj) => {
              return tpl('{host} ({channelNum})', obj)
            }
          },
          {
            'id': 'gbId',
            'sort': '',
            'name': '国标编号'
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
        colVis: [[0, 60], [1, 200, !0], [2, 200], [3, 250], [4, 120]],
        ajax: {
          init (pageInfo) {
            let group = me.jtree.getActive()
            let param = extend(pageInfo, {
              id: group.id
            })
            return Service.pageEncoder(me._p4e_ = param).then((r) => {
              me.jtable.searching(noop(), () => {
                me.totalSize = r.data.totalSize
              })
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
    addDialog () {
      return this.$refs.addDialog
    },
    editDialog () {
      return this.$refs.editDialog
    }
  },
  methods: {
    delConfirm (event) {
      this.confirm('此操作将造成数据永久被删除, 是否继续?', event)
    },
    delAjax (list) {
      Service.delCoder(list).then((r) => {
        this.msg(r)
        this.jtable.delNode(list)
        this.jtable.init()
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
        this.msg('请勾选需要删除的摄像机')
      }
    },
    addEvent () {
      this.addDialog.open({
        groupId: this.jtree.getActive().id
      })
    },
    editEvent (obj) {
      this.editDialog.open(obj)
    }
  },
  mounted () {
    this.jtree.init(() => {
      this.jtable.init()
    })
  }
}
</script>

<style lang="less">
  .res-encode {
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
    }
  }

</style>
