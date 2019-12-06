<template>
  <i-dialog ref="dialog" :top="50" height= "100%" width="100%" :title="title">
    <div class="form-content">
      <factory-render :init="renderInitFirst" ref="formFactoryFirst">
        <el-form-item>
          <el-button type="primary" :loading="loading" @click="submit">确定</el-button>
          <el-button @click="close">取消</el-button>
        </el-form-item>
      </factory-render>
    </div>
  </i-dialog>
</template>

<script>
import fieldFactory from './field'
import { camera as final } from '@/static/final'
import formFactoryMixin from '@/components/form/mixin'
import { formFactoryRender } from '@/util/render'
import {
  copyValue,
  createCascadeValue,
  destroyCascadeValue,
  formatFinal,
  initForm,
  modelTpl,
  persist
} from '@/util/form'
import { extend, fire, repeat } from '@/util/core'
import { array2tree, each } from '@/util/array'
import { isIE9 } from '@/util/browser'

export default {
  name: 'edit-form',
  mixins: [formFactoryMixin],
  data () {
    return {
      tab: 'first',
      number: ''
    }
  },
  computed: {
    jtable () {
      return this.closest('jtable')
    },
    fields () {
      return formatFinal(fieldFactory(this), final['camera'], this.option)
    },
    renderInitFirst () {
      return formFactoryRender.bind(this, this.fields.slice(0, 13), {})
    }
  },
  created () {
    this.setData(this.defModel = extend(true, modelTpl(this.fields), {
      groupId: [],
      fsIds: []
    }))
  },
  methods: {
    table () {
      return this.find('table')
    },
    getForm () {
      let formFactory = 'formFactoryFirst'
      if (this.tab === 'second') {
        formFactory = 'formFactorySecond'
      }
      return this
        .$refs[formFactory]
        .$refs.form
    },
    getFormValue () {
      let param = this.tab === 'second' ? [13] : [0, 13]
      let fields = this.fields.slice(...param)
      let map = {}

      each(fields, (filed) => {
        if (filed.name) {
          map[filed.name] = this.model[filed.name]
        }
      })

      if (this.model.id) {
        map.id = this.model.id
        map.type = this.model.type
        map.groupId = destroyCascadeValue(map.groupId)
      }

      return map
    },
    setData (model, callback) {
      let me = this
      initForm({
        model,
        ajax: [
          [Service.allGroup],
          [
            Service.getCamera, { id: model.id },
            'put'
          ]
        ],
        events: [
          (r) => {
            me.option = {
              groupId: {
                name: 'name',
                value: 'id',
                list: array2tree(r[0].data.list, 'id', 'parentId')
              }
            }
            me.number = ''
            me.cameraMaxDigit = 0
          },
          {
            method: 'put',
            fn: (r) => {
              me.data = r[1].data.object
              fire(callback, me.data)
            }
          }
        ]
      })
    },
    open (data) {
      this.model = this.defModel
      this.dialog.open(() => {
        this.setData(data, (data) => {
          let obj = {
            id: data.id,
            type: data.type
          }
          if (obj.id) {
            copyValue(obj, data, this.fields)

            /* 设置摄像机键盘编号 */
            let nodeCode = this.number || ''
            let cameraMaxDigit = ~~this.cameraMaxDigit || 0
            let kbValue = obj.cameraNo || ''
            let isGtMax = (kbValue.length > cameraMaxDigit) || cameraMaxDigit === 0
            let getKbNum = function (nodeCode, kbNum, cameraMaxDigit) {
              if (kbNum) {
                if (kbNum.slice(0, nodeCode.length) !== nodeCode) {
                  return kbNum
                }
                return [
                  nodeCode,
                  (function () {
                    let length = cameraMaxDigit - kbNum.length
                    if (length > 0) {
                      return repeat('0', length)
                    }
                    return ''
                  })(),
                  kbNum.slice(nodeCode.length, cameraMaxDigit)
                ].join('')
              }
              return ''
            }

            if (obj.type === 'local') {
              if (isGtMax) {
                obj.cameraNo = kbValue
              } else {
                obj.cameraNo = getKbNum(nodeCode, kbValue, cameraMaxDigit)
              }
            }
            obj.fsIds = obj.fsIds || []
            obj.groupId = createCascadeValue(obj.groupId, this.option.groupId.list)
          } else {
            obj = modelTpl(this.fields, this.option)
          }
          this.tab = 'first'
          this.model = extend({}, obj)
          this.dialog.end()
        })
      })
    },
    saveAjax () {
      this.start(() => {
        let model = this.getFormValue()
        persist(model, 'editCamera', 'editCamera').then((r) => {
          this.msg(r)
          this.close()
          this.jtable.init({ top0: !1 })
        }).finally(this.end)
      })
    },
    submit () {
      setTimeout(() => {
        this.validate(this.saveAjax)
      }, isIE9 ? 320 : 120)
    }
  }
}
</script>

<style lang="less">
  .res-camera {
    .el-form {
      padding: 50px 20px 120px 40px;
    }
    .el-form-item__label {
      width: 130px !important;
    }
    .el-form-item__content {
      margin-left: 130px !important;

      .el-input {
        width: 300px;
      }
      .el-textarea {
        width: 500px;
      }
    }
  }
</style>
