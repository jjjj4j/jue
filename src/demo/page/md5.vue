<template>
  <div class="ajax">Text: {{text}}</div>
</template>

<script>
import { roll, random16 } from '@/util/core'
import { array2tree } from '@/util/array'

export default {
  data () {
    return {
      text: '正在生成数据'
    }
  },
  mounted () {
    let i = 0, list = [], cache = []
    let id, node
    console.time('data create')
    for (; i < 500000; i++) {
      id = random16(16)
      node = {
        id,
        name: random16(16),
        pId: cache[roll(cache.length)]
      }
      cache.push(id)
      list.push(node)
    }
    console.timeEnd('data create')

    console.time('data parse')
    let tree = array2tree(list)
    console.log(tree)
    console.timeEnd('data parse')

    this.text = `一共生成${list.length}条数据，根节点有${tree.list.length}条`
  }
}
</script>
