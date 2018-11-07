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
  name: 'demo-jtable-1',
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
            'id': 'code',
            'name': '编号'
          }
        ],
        folder: '摄像机',
        icon: {
          root: 'ico ico-root',
          parent: 'ico ico-org'
        },
        colVis: [[0, 40], [1, '30%', !0], [2, 350]],
        ajax: {
          init () {
            return Service.allGroup().then((r) => {
              return each(r.data.list, (obj) => {
                obj.pId = obj.parentId
              })
            })
          }
        }
      }
    }
  },
  methods: {
    getCheckedList () {
      console.log(this.$refs.jtable.getCheckedList())
    }
  }
}
</script>

<style>
  .table {
    padding: 50px;
  }
</style>
