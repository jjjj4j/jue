<template>
  <div class="form-render">
    <factory-render :init="renderInit"></factory-render>
  </div>
</template>

<script>
import fieldFactory from './field'
import { formFactoryRender } from '@/util/render'

export default {
  data () {
    return {
      model: {},
      list: []
    }
  },
  created () {
    Service.pageGroup({
      id: '00000000-0000-0000-0000-000000000000'
    }).then((r) => {
      this.list = r.data.list
    })
  },
  computed: {
    fields () {
      return fieldFactory(this)
    },
    renderInit () {
      return formFactoryRender.bind(this, this.fields, {})
    }
  }
}
</script>
<style>
  .form-render label {
    display: block;
    text-align: right;
  }
  .form-render textarea {
    width: 500px;
    height: 200px;
  }
  .form-render .el-form-item__content {
    margin: -20px 0 20px 140px!important;
  }
</style>
