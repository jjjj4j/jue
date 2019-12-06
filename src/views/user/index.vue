<template>
  <div class="org-user">
    <jtree
        ref="jtree"
        :setting="jeConfig"></jtree>
    <jtable
        ref="jtable"
        :setting="jtConfig">
      <div class="btns" slot="btns">
        <el-button type="primary" size="small" @click="addEvent">添加</el-button>
      </div>
      <template slot="status" slot-scope="{node}">
        <el-switch
            width="40"
            onText=""
            offText=""
            onColor="#2d87f7"
            offColor="#ccc"
            :ref="node.id"
            :value="node.status"
            :onValue="onValue"
            :offValue="offValue"
            @change="statusEvent(node, $event)">
        </el-switch>
      </template>
      <template slot="btnCol" slot-scope="{node}">
        <div class="edit">
          <el-button type="primary" size="mini" icon="edit"
                     @click="editEvent(node)"></el-button>
          <el-button type="primary" size="mini" icon="delete2"
                     @click="delEvent(node)"></el-button>
        </div>
      </template>
    </jtable>
    <edit-form ref="dialog" :title="title"></edit-form>
  </div>
</template>

<script>
import EditForm from './dialog'
import Mixin from '../mixin'
import { tmp } from '@/util/storage'
import { v2s } from '@/util/form'
import { user as final } from '@/static/final'
import { extend } from '@/util/core'
import { ApiPrefix } from '@/service/prefix'

export default {
  name: 'user',
  mixins: [Mixin],
  components: { EditForm },
  data () {
    let me = this
    return {
      offValue: 0,
      onValue: 1,
      title: '',
      jeConfig: {
        autoInit: !1,
        list: tmp('group'),
        search: tmp('group-search'),
        scrollTop: tmp('group-top'),
        searchTop: tmp('group-search-top'),
        active: tmp('group-active'),
        icon: {
          root: 'ico ico-root',
          parent: 'ico ico-org'
        },
        click (node) {
          tmp('node-id', node.nodeId)
          me.jtree.setActive(node)
          me.jtable.clear()
          me.jtable.init()
        },
        ajax: {
          initAfter () {
            tmp('node-id', me.jtree.getActive().nodeId)
          }
        }
      },
      jtConfig: {
        autoInit: !1,
        column: [
          {
            'id': 'i',
            'name': '序号',
            'drag': !1
          },
          {
            'id': 'name',
            'name': '真实姓名',
            'keyCol': !0
          },
          {
            'id': 'sex',
            'name': '性别',
            'data': (obj) => {
              return v2s(final, 'sex', obj.sex)
            },
            'drag': !1
          },
          {
            'id': 'level',
            'name': '用户级别',
            'drag': !1
          },
          {
            'id': 'orgName',
            'name': '组织机构'
          },
          {
            'id': 'roleName',
            'name': '角色'
          },
          {
            'id': 'type',
            'name': '用户属性',
            'data': (obj) => {
              return v2s(final, 'type', obj.type)
            },
            'drag': !1
          },
          {
            'id': 'status',
            'name': '状态',
            'drag': !1,
            'data': (obj) => {
              return v2s(final, 'status', obj.status)
            }
          },
          {
            'id': 'onlineStatus',
            'name': '在线状态',
            'drag': !1,
            'data': (obj) => {
              return v2s(final, 'online', obj.onlineStatus)
            }
          },
          {
            'name': '操作',
            'btnCol': !0
          }
        ],
        icon: {
          root: 'ico ico-org-user'
        },
        colVis: [[0, 50], [1, 155, !0], [2, 50], [3, 70], [4, 120], [5, 120], [6, 120], [7, 67], [8, 70], [9, 90]],
        ajax: {
          init (pageInfo) {
            let org = me.jtree.getActive()
            let param = extend(pageInfo, {
              id: org.id
            })
            return Service.pageUser(me._p4e_ = param, ApiPrefix()).then((r) => {
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
    }
  },
  methods: {
    isMe () {
      return false
    },
    delConfirm (event) {
      this.confirm('此操作将造成数据永久被删除, 是否继续?', event)
    },
    delAjax (list, nodeId) {
      Service.delUser(list, ApiPrefix(nodeId)).then((r) => {
        this.msg(r)
        this.jtable.delNode(list)
        this.jtable.init()
      })
    },
    delEvent (node) {
      this.delConfirm(() => {
        this.delAjax([node.id], node.nodeId)
      })
    },
    delListEvent () {
      let list = this.jtable.getCheckedList()
      if (list.length > 0) {
        let nodeId = list[0].nodeId
        this.delConfirm(() => {
          this.delAjax(list.map((obj) => {
            return obj.id
          }), nodeId)
        })
      } else {
        this.msg('请勾选需要删除的用户')
      }
    },
    addEvent () {
      this.title = '添加用户'
      this.dialog.open({
        orgId: this.jtree.getActive().id
      })
    },
    editEvent (obj) {
      this.title = '编辑用户'
      this.dialog.open(obj)
    },
    statusEvent (obj, value) {
      this.find(obj.id).value = obj.status = value
      Service.editUser({
        id: obj.id,
        status: value,
        updateWay: 0
      }, ApiPrefix(obj.nodeId)).then((r) => {
        this.msg(r)
      })
    },
    handleCommand (command) {
      this[command]()
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
  .org-user {
    position: relative;

    & > .ec {
      width: 250px;
      height: 100%;
    }
    & > .tc {
      height: auto;
      width: auto;
      position: absolute;
      top: 20px;
      right: 20px;
      left: 290px;
      bottom: 20px;

      .name span.ico-org-user {
        font-size: 13px;
        font-weight: 700;
      }
    }
  }

</style>
