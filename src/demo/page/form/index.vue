<template>
  <div class="form-render">
    <factory-render :init="renderInit">
      <el-form-item label="活动区域" slot="exp">
        <el-select v-model="model.area" :lightSpeed="false" :filterable="true" placeholder="请选择活动区域">
          <el-option label="区域一" value="area1"></el-option>
          <el-option label="区域二" value="area2"></el-option>
          <el-option label="区域三" value="area3"></el-option>
          <el-option label="区域四" value="area4"></el-option>
          <el-option label="区域五" value="area5"></el-option>
          <el-option label="区域六" value="area6"></el-option>
          <el-option label="区域七" value="area7"></el-option>
          <el-option label="区域八" value="area8"></el-option>
          <el-option label="区域九" value="area9"></el-option>
          <el-option label="区域十" value="area10"></el-option>
          <el-option label="区域十一" value="area11"></el-option>
          <el-option label="区域十二" value="area12"></el-option>
        </el-select>
      </el-form-item>
    </factory-render>
  </div>
</template>

<script>
import fieldFactory from './field'
import { formFactoryRender } from '@/util/render'
import ElOption from '@/elext/select/src/option'
import { map } from '@/util/array'

export default {
  data () {
    return {
      model: {
        area: 'area5'
      },
      list: []
    }
  },
  components: { ElOption },
  created () {
    Service.pageGroup({
      id: '1db1977f-ca4c-71ac-b145-fa854936cce8'
    }).then((r) => {
      this.list = map(r.data.list, (item) => {
        return {
          value: item.id,
          label: item.name
        }
      })
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
</style>
