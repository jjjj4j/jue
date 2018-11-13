<template>
  <div class="table">
    <jtree
        ref="jtree"
        :setting="jtree">
      <div class="btns" slot="btns">
        <el-button type="primary" size="small" @click="getCheckedList">获取选中项</el-button>
      </div>
    </jtree>
  </div>
</template>

<script>
import { each } from '@/util/array'

export default {
  name: 'demo-jtable-2',
  data () {
    return {
      jtree: {
        selectable: !0,
        column: [
          {
            'id': 'j',
            'name': '序号',
            'drag': !1
          },
          {
            'id': 'name',
            'name': '名称',
            'keyCol': !0
          },
          {
            'id': 'chanNo',
            'sort': '',
            'name': '通道号'
          },
          {
            'id': 'ptz',
            'name': '云台类型'
          }
        ],
        folder: '摄像机',
        icon: {
          root: 'ico ico-root',
          parent: 'ico ico-org',
          child: 'ico ico-gun-camera',
          folder: 'ico ico-folder'
        },
        colVis: [[0, 40], [1, 200, !0], [2, 150], [3, 150]],
        colGroup: [1],
        ajax: {
          init () {
            return Service.allGroup().then((r) => {
              return each(r.data.list, (obj) => {
                obj.pId = obj.parentId
              })
            })
          },
          open (org) {
            return Service.listCamera({
              id: org.id
            }).then((r) => {
              return r.data.list
            })
          },
          search (search) {
            return Service.allCamera(search).then((r) => {
              return each(r.data.list, (obj) => {
                obj.pId = obj.groupId
              })
            })
          }
        }
      }
    }
  },
  methods: {
    getCheckedList () {
      console.log(this.$refs.jtree.getCheckedList())
    }
  }
}
</script>

<style>
  .table {
    padding: 50px;
  }
</style>
