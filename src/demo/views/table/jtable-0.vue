<template>
  <div class="table">
    <jtable
        ref="jtable"
        :setting="jtable">
      <div class="btns" slot="btns">
        <el-button type="primary" size="small" @click="getCheckedList">获取选中项</el-button>
      </div>
      <template slot="btnCol" slot-scope="{node}">
        <div class="edit">
          <el-button type="primary" size="mini" icon="edit" @click="colClick(node)"></el-button>
        </div>
      </template>
    </jtable>
  </div>
</template>

<script>
export default {
  name: 'demo-jtable',
  data () {
    return {
      jtable: {
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
            'id': 'code',
            'name': '唯一标识'
          },
          {
            'id': 'areaCode',
            'name': '行政区划'
          },
          {
            'name': '操作',
            'btnCol': !0
          }
        ],
        icon: {
          parent: 'ico ico-org'
        },
        colVis: [[0, 40], [1, '30%', !0], [2, 150], [3, 150], [4, 50]],
        ajax: {
          init (pageInfo) {
            pageInfo.id = '1db1977f-ca4c-71ac-b145-fa854936cce8'
            return Service.pageGroup(pageInfo).then((r) => {
              return r.data
            })
          },
          open (node) {
            return Service.listCamera({
              id: node.id
            }).then((r) => {
              return r.data.list
            })
          }
        }
      }
    }
  },
  methods: {
    colClick (node) {
      console.log(node)
    },
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
