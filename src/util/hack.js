import { each } from '@/util/array'
import { isArray } from '@/util/core'
import { isIE9 } from '@/util/browser'

export function tooltips (e) {
  if (!e && isIE9) {
    let list = this.$refs.tooltip
    setTimeout(() => {
      if (isArray(list)) {
        each(list, (item) => item.doDestroy())
      } else if (list) {
        list.doDestroy()
      }
    }, 0)
  }
}
