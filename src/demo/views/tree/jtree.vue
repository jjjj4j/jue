<template>
  <div class="tree">
    <jtree
        ref="jtree"
        :setting="jtree"></jtree>
  </div>
</template>

<script>
import { each } from '@/util/array'

export default {
  name: 'demo-jtree',
  data () {
    let me = this
    return {
      jtree: {
        autoInit: !1,
        width: '100%',
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
</style>
