<template>
  <div class="form-render">
    <factory-render ref="formFactory" :init="renderInit">
      <el-form-item label="监控区域" slot="exp">
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
      <el-form-item>
        <el-button type="primary" :loading="loading" @click="submit">确定</el-button>
        <el-button @click="close">取消</el-button>
      </el-form-item>
    </factory-render>
  </div>
</template>

<script>
import fieldFactory from './field'
import { formFactoryRender } from '@/util/render'
import { array2tree } from '@/util/array'
import { formatFinal } from '@/util/form'
import { camera as final } from '@/static/final'

export default {
  data () {
    return {
      model: {},
      option: {}
    }
  },
  created () {
    Service.pageGroup({
      id: '1db1977f-ca4c-71ac-b145-fa854936cce8'
    }).then((r) => {
      this.option = {
        groupId: {
          name: 'name',
          value: 'id',
          list: array2tree(r.data.list, 'id', 'parentId').list
        }
      }
    })
  },
  mounted () {
    setTimeout(() => {
      this.model = {
        name: '测试',
        area: 'area5',
        groupId: '',
        position: 2,
        otherParam: 'exp  = 1',
        comment: '这是一个测试页面'
      }
    }, 1000)
  },
  computed: {
    fields () {
      return formatFinal(fieldFactory(this), final, this.option)
    },
    renderInit () {
      return formFactoryRender.bind(this, this.fields, {})
    }
  },
  methods: {
    form () {
      return this.$refs.formFactory.$refs.form
    },
    saveAjax () {
      console.log(this.model)
    },
    validate (success, fail, excluded) {
      this.form().validate((valid, errors) => {
        if (valid) {
          success && success.call(this)
        } else {
          fail && fail.call(this, errors)
          return false
        }
      }, excluded)
    },
    submit () {
      this.validate(this.saveAjax)
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
