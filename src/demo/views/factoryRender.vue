<template>
  <div class="factory-render">
    <factory-render :init="renderInit">
      <div slot="exp">具名插槽展示</div>
      <div slot="exp2" slot-scope="{text}">具名插槽作用域解构：{{text}}</div>
      <div slot-scope="data">插槽作用域：{{data}}</div>
    </factory-render>
  </div>
</template>

<script>
import { factoryRender } from '@/util/render'

export default {
  computed: {
    renderInit () {
      return factoryRender.bind(this, {
        tag: 'div',
        children: ['这是一个FactoryRender创建的DIV', {
          tag: 'div',
          slot: 'exp'
        }, {
          slot: {
            name: 'exp2',
            data: {
              text: 'PVM'
            }
          }
        }, {
          slot () {
            return {
              data: {
                id: 'PVM2'
              }
            }
          }
        }]
      }, {})
    }
  }
}
</script>
