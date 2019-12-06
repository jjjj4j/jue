<template>
  <div class="edit-permit" :class="{'full': maximize}">
    <div class="maximize" :title="maximize ? '恢复窗口': '最大化'"
         @click="maxEvent">
      <span class="ico" :class="{
           'ico-resize-full' : maximize,
           'ico-resize' : !maximize
      }"></span>
    </div>
    <div class="res">
      <div class="title">摄像机权限</div>
      <div class="content">
        <div class="group">
          <jtree
              ref="groupTree"
              :setting="groupTreeConfig"></jtree>
        </div>
        <div class="camera">
          <jtree
              ref="cameraTable"
              :setting="cameraTableConfig">
            <template slot="btnCol" slot-scope="{node}">
              <div class="edit">
                <el-button type="primary" size="mini" icon="edit"
                           @click="editEvent(node)"></el-button>
                <el-button type="primary" size="mini" icon="delete2"
                           @click="delEvent(node)"></el-button>
              </div>
            </template>
          </jtree>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { fire, isDefined } from '@/util/core'
import { ApiPrefix } from '@/service/prefix'
import { tmp } from '@/util/storage'
import { v2s } from '@/util/form'
import { camera as final } from '@/static/final'
import { each } from '@/util/array'

export default {
  name: 'edit-permit',
  data () {
    let me = this
    me.groupTreeConfig = {
      autoInit: !1,
      selectable: !0,
      width: 250,
      list: tmp('group'),
      icon: {
        root: 'ico ico-root',
        parent: 'ico ico-folder'
      },
      click (node) {
        me.jtable.clear()
        me.jtable.init()
        me.jtree.setActive(node)
      },
      ajax: {
        initAfter () {
          let node
          const list = []
          Service.listGroupPermit((r) => {
            each(r.data.group, (item) => {
              if (!list.includes(item.groupId)) {
                node = me.jtree.cacheParent(item.groupId)
                me.jtree.changeChecked2(node, !0)
                list.push(node.id)
              }
            })
            me.jtree.update(!1)
          })
        }
      },
      check (node, checked) {
        return new Promise(function (resolve, reject) {
          Service.editGroupRes({
            id: node.id,
            userId: me.model.id,
            checked
          }, () => {
            resolve()
          }, () => {
            reject('保存失败')
          })
        }).finally(() => {
          setTimeout(() => {
            me.jtable.clear()
            me.jtable.init()
          }, 200)
        })
      }
    }
    me.cameraTableConfig = {
      autoInit: !1,
      selectable: !0,
      column: [
        {
          'id': 'name',
          'name': '名称',
          'sort': '',
          'keyCol': !0,
          'uncheck' () {
            let node = me.jtree.getActive()
            if (node) {
              return node.checked
            }
            return !1
          }
        },
        {
          'id': 'cameraNo',
          'name': '键盘编号'
        },
        {
          'id': 'chanNo',
          'sort': '',
          'name': '通道号'
        },
        {
          'id': 'ptz',
          'name': '云台类型',
          'sort': '',
          'data': (obj) => {
            return v2s(final, 'ptz', obj.ptz)
          }
        }
      ],
      icon: {
        root: 'el-icon-setting',
        parent: 'el-icon-menu'
      },
      colVis: [[0, '20%', !0], [1, '20%'], [2, 100], [3, 80]],
      ajax: {
        init () {
          let group = me.jtree.getActive()

          return Promise.all([
            Service.listCameraPermit({
              id: group.id,
              userId: me.model.id
            }),
            Service.getSelfPermit({
              id: me.jtree.getActive().id,
              userId: me.model.id
            })
          ]).then((r) => {
            let checked = r[1].data.flag || group.checked
            return each(r[0].data.list, (item) => {
              item.checked = checked || item.flag
            })
          })
        }
      },
      topCheckedEvent (topChecked) {
        let list = me.jtable.checkedCache
        let cache = []
        let param = {
          addSelf: '',
          delSelf: '',
          delCameras: [],
          addCameras: [],
          userId: me.model.id
        }
        each(list, (item) => {
          if (item.flag) {
            cache.push(item.id)
          }
        })
        if (topChecked) {
          param.addSelf = me.jtree.getActive().id
        } else {
          param.delSelf = me.jtree.getActive().id
          param.delCameras = cache
        }
        console.log(param)
        return Service.saveResPermit(param, () => {
          each(cache, (id) => {
            let node = me.jtable.cacheParent(id)
            node.flag = undefined
          })
        })
      },
      check (node, checked) {
        let list = me.jtable.checkedCache
        let cameras = me.jtable.normalIndex
        let cache = []
        let param = {
          addSelf: '',
          delSelf: '',
          delCameras: [],
          addCameras: [],
          userId: me.model.id
        }
        if (checked) {
          if (list.length === cameras.length - 1) {
            each(list, (item) => {
              if (item.flag) {
                cache.push(item.id)
              }
            })
            console.log(node)
            param.addSelf = node.groupId
            param.delCameras = cache
          } else {
            if (node.flag === false) {
              param.addCameras = [node.id]
            }
          }
        } else {
          if (node.flag === true) {
            param.delCameras = [node.id]
          }
          if (cameras.length === list.length) {
            param.delSelf = node.groupId
          }
        }
        console.log(param)
        return Service.saveResPermit(param, function () {
          if (isDefined(param.addSelf)) {
            each(cameras, (item) => {
              item.flag = undefined
            })
          }
          if (isDefined(param.delSelf)) {
            each(cameras, (item) => {
              item.flag = item.checked
            })
          }
          if (isDefined(param.addCameras)) {
            each(param.addCameras, (id) => {
              let node = me.jtable.cacheParent(id)
              node.flag = !0
            })
          }
          if (isDefined(param.delCameras)) {
            each(param.delCameras, (id) => {
              let node = me.jtable.cacheParent(id)
              node.flag = !1
            })
          }
        })
      }
    }
    return {
      maximize: !1
    }
  },
  props: {
    model: Object
  },
  computed: {
    jtree () {
      return this.$refs.groupTree
    },
    jtable () {
      return this.$refs.cameraTable
    }
  },
  methods: {
    init () {
      this.jtree.init(() => {
        this.jtable.init()
      })
    },
    resize () {
      this.$nextTick(() => {
        $(window).trigger('resize')
      })
    },
    maxEvent () {
      this.maximize = !this.maximize
      this.resize()
    },
    ApiPrefix () {
      return ApiPrefix(this.model.nodeId)
    },
    submitRes () {
      return Service.editRes({}, this.ApiPrefix())
    },
    submit (callback) {
      this.submitRes().then(r => fire(callback, r), r => this.msg(r))
    }
  }
}
</script>

<style lang="less">
  .edit-permit {
    position: relative;
    width: 100%;
    height: 100%;
    border-radius: 3px;
    border: 1px solid #a4d5f9;

    &.full {
      overflow: hidden;
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      height: auto !important;
      z-index: 9999;
      border-radius: 0;
      background-color: #fff;
    }

    .maximize {
      position: absolute;
      right: 0;
      width: 40px;
      height: 40px;
      z-index: 1031;
      color: #fff;
      line-height: 40px;
      text-align: center;
      cursor: pointer;

      &:hover {
        font-weight: 800;
      }
    }

    .res {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;

      .title {
        height: 40px;
        width: 100%;
        background-color: #2d87f9;
        color: #fff;
        padding-left: 20px;
      }

      .content {
        position: relative;
        width: 100%;
        height: calc(~'100% - 40px');
      }

      .group, .camera {
        position: absolute;
        top: 0;
        bottom: 0;
      }

      .group {
        left: 0;
        width: 300px;
      }

      .camera {
        right: 0;
        width: calc(~'100% - 300px');

        table {
          border: 0;

          .el-checkbox__label {
            font-size: 12px;
          }

          th .el-checkbox__label {
            font-weight: 700;
          }
        }

        th, td {
          border: 0;
          box-sizing: content-box;
        }

        td.name {
          line-height: normal;

          .no-open {
            display: none;
          }
        }
      }

      .toolbar {
        display: none;
      }
    }
  }
</style>
