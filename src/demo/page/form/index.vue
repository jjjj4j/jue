<template>
  <div class="factory-render">
    <p>
      {{model.name}}
      {{model.sex}}
      {{model.gbId}}
      {{model.roles}}
    </p>
    <factory-render :init="renderInit"></factory-render>
  </div>
</template>

<script>
import { factoryRender } from '@/util/render'

export default {
  data () {
    return {
      model: {
        name: 'zj',
        sex: '男',
        gbId: '',
        roles: ''
      }
    }
  },
  computed: {
    renderInit () {
      let me = this
      return factoryRender.bind(this, {
        tag: 'div',
        children: [{
          tag: 'el-input',
          data: {
            on: {
              input (e) {
                me.model.name = e.target.value
              }
            }
          }
        }, {
          tag: 'el-input',
          data: {
            attrs: {
              value: me.model.sex
            }
          }
        }]
      }, {})
    }
  }
}
</script>
