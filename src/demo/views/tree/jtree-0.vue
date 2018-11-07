<template>
  <div class="tree">
    <div class="tree-btns">
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
  name: 'demo-jtree-0',
  data () {
    let me = this
    return {
      jtree: {
        autoInit: !1,
        selectable: !0,
        width: 250,
        icon: {
          root: 'ico ico-root',
          parent: 'ico ico-org'
        },
        click (node) {
          me.$refs.jtree.setActive(node)
        }
      }
    }
  },
  methods: {
    getCheckedList () {
      console.log(this.$refs.jtree.getCheckedList())
    }
  },
  mounted () {
    Service['allOrg']((r) => {
      let jtree = this.$refs.jtree
      jtree.list = each(r.data.list, (obj) => {
        obj.pId = obj.parentId
      })
      jtree.init()
    })
  }
}
</script>

<style>
  .tree {
    width: 350px;
    height: 100%;
    padding: 50px;
  }

  .tree-btns {
    position: absolute;
    margin-left: 300px;
  }
</style>
