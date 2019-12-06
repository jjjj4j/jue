<template>
  <div class="res-camera">
    <jtree
        ref="jtree"
        :setting="jeConfig"></jtree>
    <jtable
        ref="jtable"
        :setting="jtConfig">
      <div class="btns" slot="btns">
        <el-button type="primary" size='small' @click="delListEvent">删除</el-button>
        <el-checkbox v-model="isRecursion" label="递归查询" style="margin-left:20px; display: none;"
                     @change="handleRecursion()"></el-checkbox>
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
    <edit-form ref="dialog" :title="title"></edit-form>
  </div>
</template>

<script>
import EditForm from './dialog'
import Mixin from '../mixin'
import { camera as final } from '@/static/final'
import { v2s } from '@/util/form'
import { extend, noop } from '@/util/core'
import { tmp } from '@/util/storage'

export default {
  name: 'camera',
  mixins: [Mixin],
  components: {
    EditForm
  },
  data () {
    let me = this
    return {
      isRecursion: false,
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
            'id': 'gbId',
            'sort': '',
            'name': '国标编号'
          },
          {
            'id': 'cameraNo',
            'name': '键盘编号'
          },
          {
            'id': 'deviceName',
            'sort': '',
            'name': '所属设备'
          },
          {
            'id': 'chanNo',
            'sort': '',
            'name': '通道号'
          },
          {
            'id': 'groupName',
            'name': '所属分组'
          },
          {
            'id': 'ptz',
            'name': '云台类型',
            'sort': '',
            'data': (obj) => {
              return v2s(final, 'ptz', obj.ptz)
            }
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
        colVis: [[0, 60], [1, 150, !0], [2, 150], [3, 120], [4, 120], [5, 100], [6, 100], [7, 120], [8, 120]],
        ajax: {
          init (pageInfo) {
            let group = me.jtree.getActive()
            let param = extend(pageInfo, {
              id: group.id,
              isRecursion: me.isRecursion
            })
            return Service.pageCamera(param).then((r) => {
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
    dialog () {
      return this.$refs.dialog
    }
  },
  methods: {
    handleRecursion () {
      this.$refs.jtable.init()
    },
    delConfirm (event) {
      this.confirm('此操作将造成数据永久被删除, 是否继续?', event)
    },
    delAjax (list) {
      Service.delCamera(list).then((r) => {
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
      this.title = '添加摄像机'
      this.dialog.open({})
    },
    editEvent (obj) {
      this.title = '编辑摄像机'
      this.dialog.open(obj)
    },
    handleCommand (command) {
      this[command]()
    },
    initJtable (e) {
      setTimeout(() => {
        this.jtable.init()
      }, 100)
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
  .res-camera {
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

    .el-tab-pane .tc {
      left: 20px;
    }

    .filter-content {
      position: relative;
      padding: 5px 0;
      border: 1px solid #eee;

      &:before {
        content: "";
        position: absolute;
        top: -5px;
        right: 2px;
        height: 8px;
        width: 8px;
        background: white;
        transform: rotate(45deg);
        -ms-transform: rotate(45deg);
        -webkit-transform: rotate(45deg);
        border-top: 1px solid #eee;
        border-left: 1px solid #eee;
      }

      label {
        width: 100%;
        padding: 5px 10px;
        color: #555;
        display: block;

        .el-checkbox__label {
          font-size: 13px;
        }

        .el-checkbox__input {
          top: -1px;
        }

        &:hover {
          background: #4c9bff;
          color: #fff;

          .el-checkbox__input.is-checked .el-checkbox__inner {
            background-color: #fff;

            &:after {
              border-color: #4c9bff;
            }
          }
        }
      }
    }
  }

</style>
