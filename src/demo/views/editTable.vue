<template>
  <el-form :model="model">
    <div class="edit-table-demo">
      <edit-table
          ref="editTable"
          :list="model.table"
          :setting="etConfig">
        <template slot="btnCol" slot-scope="{node}">
          <el-button type="primary" size="mini" icon="edit" @click="link(node)"></el-button>
          <el-button type="primary" size="mini" icon="delete" @click="del(node)"></el-button>
        </template>
      </edit-table>
    </div>
  </el-form>
</template>

<script>
import reg from '@/static/reg'
import EditTable from '@/components/editTable'

export default {
  name: 'edit-table-demo',
  components: { EditTable },
  data () {
    return {
      model: {
        table: [
          {
            channel: 'PVG511/0012-23-2',
            deviceId: '2bc593dd1',
            channelNo: '2'
          }, {
            channel: 'PVG511/0012-23-2',
            deviceId: '2bc593dd1',
            channelNo: '4'
          }
        ]
      },
      etConfig: {
        prefix: 'table',
        column: [
          {
            'id': 'i',
            'name': '序号',
            'drag': !1
          },
          {
            'id': 'channel',
            'type': 'text',
            'rule': [
              reg.required,
              reg.str64
            ],
            'name': 'PVG5.x输出干线号'
          },
          {
            'id': 'deviceId',
            'type': 'select',
            'rule': [
              reg.required
            ],
            'init' (data) {
              return [
                'pageGroup', {
                  id: '1db1977f-ca4c-71ac-b145-fa854936cce8'
                }
              ]
            },
            'name': '对应设备'
          },
          {
            'id': 'channelNo',
            'type': 'select',
            'rule': [
              reg.required
            ],
            'init' (data) {
              let deviceId = data.deviceId
              if (deviceId) {
                return [
                  'pageGroup', {
                    id: '1db1977f-ca4c-71ac-b145-fa854936cce8'
                  }
                ]
              }
            },
            'name': '通道号'
          },
          {
            'name': '操作',
            'btnCol': !0
          }
        ],
        colVis: [[0, 40], [1, 350], [2, 250, !0], [3, 150], [4, 100]]
      }
    }
  },
  computed: {
    editTable () {
      return this.$refs.editTable
    }
  },
  methods: {
    del (node) {
      this.editTable.delNode(node)
    },
    link (node) {
      console.log(node)
    }
  }
}
</script>

<style>
  .edit-table-demo {
    padding: 50px;
  }
</style>
