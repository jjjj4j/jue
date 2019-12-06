<template>
  <i-dialog ref="dialog" :top="50" height= "100%" width="100%" :title="title">
    <div class="form-content">
      <factory-render :init="renderInit" ref="formFactory">
        <el-form-item>
          <el-button type="primary" :loading="loading" @click="submit">确定</el-button>
          <el-button @click="close">取消</el-button>
        </el-form-item>
      </factory-render>
    </div>
  </i-dialog>
</template>

<script>
import formFactoryMixin from '@/components/form/mixin'
import fieldFactory from './field'
import { encode } from '@/static/final'
import { createCascadeValue, destroyCascadeValue, formatFinal, initForm, modelTpl } from '@/util/form'
import { extend, fire } from '@/util/core'
import { array2tree, each } from '@/util/array'

export default {
  name: 'edit-form',
  mixins: [formFactoryMixin],
  data () {
    return {
      option: {},
      tab: 'second'
    }
  },
  computed: {
    jtable () {
      return this.closest('jtable')
    },
    fields () {
      return formatFinal(fieldFactory(this), encode, this.option)
    }
  },
  created () {
    this.setData(this.defModel = extend(true, modelTpl(this.fields), {
      groupId: []
    }))
  },
  methods: {
    getFormValue () {
      let fields = this.fields
      let map = {}

      each(fields, (filed) => {
        if (filed.name && (!filed.show || filed.show())) {
          map[filed.name] = this.model[filed.name]
        }
      })

      map.groupId = destroyCascadeValue(map.groupId)

      console.log(map)

      return map
    },
    setData (model, callback) {
      let me = this
      initForm({
        model,
        ajax: [
          [Service.allGroup]
        ],
        events: [
          (r) => {
            me.option = {
              groupId: {
                name: 'name',
                value: 'id',
                list: array2tree(r[0].data.list || [], 'id', 'parentId').list
              }
            }
          },
          {
            method: 'post',
            fn: (r) => {
              me.data = model
            }
          },
          () => {
            fire(callback, me.data)
          }
        ]
      })
    },
    open (data) {
      this.model = this.defModel
      this.dialog.open(() => {
        this.setData(data, (data) => {
          this.model = extend(true, {}, modelTpl(this.fields, data))
          setTimeout(() => {
            this.fields[2].change(this.model.protocol)
          }, 250)
          this.model.groupId = createCascadeValue(this.model.groupId, this.option.groupId.list)
          this.dialog.end()
        })
      })
    },
    saveAjax () {
      this.start(() => {
        Service.addEncoderList(
          this.getFormValue()
        ).then((r) => {
          this.msg(r)
          this.close()
          this.jtable.init()
        }).finally(this.end)
      })
    }
  }
}
</script>

<style lang="less">
  .res-encode {
    .el-tabs {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      background-color: #fff;
    }

    .el-tabs__header {
      margin-bottom: 0;
    }

    .el-form-item__label {
      width: 160px !important;
    }

    .el-form-item__content {
      margin-left: 160px !important;

      .el-input {
        width: 300px;
      }
      .el-textarea {
        width: 500px;
      }
    }
  }
</style>
