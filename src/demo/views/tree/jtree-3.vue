<template>
  <div class="tree">
    <jtree
        ref="jtree"
        :setting="jtree"></jtree>
  </div>
</template>

<script>
import { each } from '@/util/array'
import { random16 } from '@/util/core'

export default {
  name: 'demo-jtree-1',
  data () {
    let me = this
    return {
      jtree: {
        isShow: !1,
        width: 250,
        folder: '用户',
        icon (node) {
          if (!node.type && node.jtype === 'child') {
            return 'el-icon-picture'
          } else {
            if (node.deep === 0) {
              return 'ico ico-root'
            } else {
              return ({
                parent: 'ico ico-org',
                child: 'ico ico-org-role',
                folder: 'ico ico-folder'
              })[node.jtype]
            }
          }
        },
        click (node) {
          me.$refs.jtree.setActive(node)
        },
        ajax: {
          init () {
            return Service.allOrg().then((r) => {
              return each(r.data.list, (obj) => {
                obj.pId = obj.parentId
              })
            })
          },
          open (node) {
            if (node.jtype === 'parent') {
              return [
                Service.listUser({
                  id: node.id
                }).then((r) => {
                  return each(r.data.list, (obj) => {
                    obj.children = []
                    obj.children2 = []
                    obj.ajaxed = !1
                    obj.ajaxing = !1
                    obj.open = !1
                    obj.open2 = !1
                    obj.type = 'user'
                  })
                }),
                '用户' // 本部名称将使用 '用户'
              ]
            } else if (node.type === 'user') {
              return [
                new Promise((resolve) => {
                  setTimeout(() => {
                    resolve([
                      {
                        id: random16(8),
                        name: '笔记本001'
                      },
                      {
                        id: random16(8),
                        name: '笔记本002'
                      }
                    ])
                  }, 250)
                }),
                '办公用品' // 不再使用本部
              ]
            }
          },
          search (search) {
            return Service.allUser(search).then((r) => {
              return each(r.data.list, (obj) => {
                obj.pId = obj.orgId
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
