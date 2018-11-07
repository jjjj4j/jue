<template>
  <div class="tree">
    <jtree
        ref="jtree"
        :setting="jtree"></jtree>
  </div>
</template>

<script>
import { each } from '@/util/array'
import { repeat } from '@/util/core'

export default {
  name: 'demo-jtree-1',
  data () {
    let me = this
    return {
      jtree: {
        width: 250,
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
          init () {
            return Service.allGroup().then((r) => {
              return each(r.data.list, (obj) => {
                obj.pId = obj.parentId
              })
            })
          },
          open (org) {
            return new Promise((resolve) => {
              let count = 600000
              let list = []
              me.I = me.I || 0
              for (let i = 1; i <= count; i++) {
                list.push({
                  id: me.I + repeat('0', 18 - ('' + i).length) + i,
                  name: '摄像机' + me.I + i
                })
              }
              resolve((++me.I, list))
            })
            /* return Service.allCamera({
                groupId: org.id
              }).then((r) => {
                return r.data.list
              }) */
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
