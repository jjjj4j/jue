<template>
  <div class="tree">
    <div class="tree-btns">
      <el-button @click="addNode">添加</el-button>
      <el-button @click="updateNode">更新</el-button>
      <el-button @click="delNode">删除</el-button>
      <el-button @click="getCheckedList">获取勾选</el-button>
    </div>
    <jtree
        ref="jtree"
        :setting="jtree"></jtree>
  </div>
</template>

<script>
import { each } from '@/util/array'

export default {
  name: 'demo-jtree-1',
  data () {
    let me = this
    return {
      jtree: {
        width: 250,
        selectable: !0,
        folder: '摄像机',
        icon: {
          root: 'ico ico-root',
          parent: 'ico ico-org',
          child: 'ico ico-gun-camera',
          folder: 'ico ico-folder'
        },
        click (node) {
          me.$refs.jtree.setActive(node)
        },
        ajax: {
          init (pageInfo) {
            return Service.allGroup().then((r) => {
              return each(r.data.list, (obj) => {
                obj.pId = obj.parentId
              })
            })
          },
          open (org) {
            return Service.allCamera({
              groupId: org.id
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
    },
    delNode () {
      let jtree = this.$refs.jtree
      let list = jtree.list
      jtree.delNode(list[0].id, list[0].jtype)
    },
    addNode () {
      let jtree = this.$refs.jtree
      jtree.addNode({
        id: '9527',
        name: '测试节点（新建）'
      })
    },
    updateNode () {
      let jtree = this.$refs.jtree
      jtree.updateNode({
        id: '9527',
        name: '测试节点（更新）'
      })
    }
  }
}
</script>

<style>
  .tree {
    width: 350px;
    height: calc(100% - 100px);
    padding: 50px;
  }

  .tree-btns {
    position: absolute;
    margin-left: 370px;
  }
</style>
