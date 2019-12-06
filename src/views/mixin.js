import { tmp } from '@/util/storage'
import { isRoot } from '@/util/form'
import { each } from '@/util/array'

export default {
  beforeRouteEnter (to, from, next) {
    let list = tmp('group')
    if (!list || list.length === 0) {
      Service.allGroup().then((r) => {
        tmp('group', each(r.data.list, (obj) => {
          obj.pId = obj.parentId
          obj.open = isRoot(obj.pId)
        }))
        next()
      })
    } else {
      next()
    }
  },
  beforeRouteLeave (to, from, next) {
    tmp('group', this.jtree.list)
    tmp('group-search', this.jtree.search)
    tmp('group-search-top', this.jtree.searchTop)
    tmp('group-top', this.jtree.normalTop)
    tmp('group-active', this.jtree.getActive())
    next()
  }
}
