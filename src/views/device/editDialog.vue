<template>
  <i-dialog ref="dialog" :top="50" height= "100%" width="100%" class="encode-edit-dialog" :title="title">
    <div class="edit-encoder">
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
import fieldFactory from './field'
import { encode } from '@/static/final'
import formFactoryMixin from '@/components/form/mixin'
import { copyValue, createCascadeValue, destroyCascadeValue, formatFinal, initForm, modelTpl } from '@/util/form'
import { extend, fire } from '@/util/core'
import { array2tree, each } from '@/util/array'
import { json2str, str2json } from '@/util/json'

let VOICE_TALK = 'voiceTalk'

export default {
  name: 'edit-form',
  mixins: [formFactoryMixin],
  data () {
    return {
      option: {},
      deviceType: 'encode'
    }
  },
  computed: {
    jtable () {
      return this.closest('jtable')
    },
    fields () {
      return formatFinal(fieldFactory(this, 'edit'), encode, this.option)
    }
  },
  created () {
    this.setData(this.defModel = extend(true, modelTpl(this.fields), {
      groupId: []
    }))
  },
  methods: {
    ipAddPort (item) {
      let port = item.gbPort || item.port
      if (port) {
        return [item.host, port].join(':')
      }
      return item.host
    },
    getFormValue () {
      let fields = this.fields
      let map = {
        id: this.data.id,
        useType: this.data.useType
      }
      each(fields, (filed) => {
        if (filed.name && (!filed.show || filed.show())) {
          map[filed.name] = this.model[filed.name]
        }
      })

      map.groupId = destroyCascadeValue(map.groupId)

      if (map.deviceProperty) {
        let list = extend(true, [], map.deviceProperty)
        let index = list.indexOf(VOICE_TALK)
        if (index >= 0) {
          list.splice(index, 1)
          map.voiceTalk = 1
          map.deviceProperty = list
        } else {
          map.voiceTalk = 0
        }
        map.deviceProperty = json2str(map.deviceProperty)
      }

      return map
    },
    setData (model, callback) {
      let me = this
      let id = model.id
      initForm({
        model,
        ajax: [
          [Service.allGroup],
          [Service.getEncoder, { id }, 'put']
        ],
        events: [
          (r) => {
            me.option = {
              groupId: {
                name: 'name',
                value: 'id',
                list: array2tree(r[0].data.list, 'id', 'parentId').list
              }
            }
          },
          {
            method: 'put',
            fn: (r) => {
              fire(callback, me.data = r[1].data.object)
            }
          }
        ]
      })
    },
    open (data, flag) {
      let open = this.dialog.open
      let end = this.dialog.end
      if (flag) {
        end = open = (callback) => {
          fire(callback)
        }
      }

      this.initProtocolEvent = !1
      this.model = this.defModel

      open(() => {
        this.setData(data, (data) => {
          let obj = {
            id: data.id,
            access: data.access,
            useType: data.useType
          }
          copyValue(obj, data, this.fields)
          if (data.deviceProperty) {
            obj.deviceProperty = str2json(data.deviceProperty) || []
            if (data.voiceTalk) {
              obj.deviceProperty.push(VOICE_TALK)
            }
          } else {
            obj.deviceProperty = []
          }

          obj.heartDetection = data.heartDetection
          if (obj.heartDetection) {
            obj.heartTimeoutTimes = data.heartTimeoutTimes
            obj.heartTimeoutTime = data.heartTimeoutTime
          }

          obj.groupId = createCascadeValue(obj.groupId, this.option.groupId.list)
          this.model = extend(true, {}, obj)
          this.$nextTick(() => {
            this.initProtocolEvent = !0
          })
          this.initial = this.getFormValue()
          end()
        })
      })
    },
    saveAjax () {
      this.start(() => {
        let model = this.getFormValue()
        Service['editCoder'](model).then((r) => {
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
    .el-form {
      padding: 50px 20px 100px 40px;
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
