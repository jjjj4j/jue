<template>
  <i-dialog ref="dialog" :top="50" height= "100%" width="100%" :title="title" @close="closeEvent">
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
import fieldFactory from './field'
import { user as final } from '@/static/final'
import formFactoryMixin from '@/components/form/mixin'
import reg from '@/static/reg'
import { MD5 } from '@/util/md5'
import { array2tree, each, map } from '@/util/array'
import {
  copyValue,
  createCascadeValue,
  destroyCascadeValue,
  formatFinal,
  initForm,
  ip,
  mac,
  modelTpl, persist
} from '@/util/form'
import { extend, fire } from '@/util/core'
import { encoder } from '@/util/base64'
import { json2str, str2json } from '@/util/json'
import { ApiPrefix } from '@/service/prefix'

let _TRIGGER_ = 'change'

let defVideoLimit = () => {
  return { type: 0, d: 0, h: 0, m: 0 }
}
let staticModel = {
  ip: [],
  ipRange: [],
  safeIp: [],
  safeMac: [],
  videoLimit: defVideoLimit(),
  fingerCheck: !1,
  fingerVein: {}
}
let getIp3 = (ip) => ip.split('.').slice(0, 3).join()
let getValue = (name, model) => {
  let value = model
  each(name.split('.'), (attr) => {
    value = value[attr]
  })
  return value
}

export default {
  name: 'edit-form',
  mixins: [formFactoryMixin],
  data () {
    let me = this
    return {
      etMac: {
        prefix: 'safeMac',
        column: [
          {
            'id': 'i',
            'name': '序号',
            'drag': !1
          },
          {
            'id': 'safeMac',
            'type': 'text',
            'rule': [
              reg.required,
              reg.macAddr
            ],
            'name': 'MAC地址',
            'increment' (val) {
              return mac(val).add(1).val()
            }
          },
          {
            'name': '操作',
            'btnCol': !0
          }
        ],
        colVis: [[0, 40], [1, 359], [2, 100]]
      },
      etIp: {
        prefix: 'ip',
        column: [
          {
            'id': 'i',
            'name': '序号',
            'drag': !1
          },
          {
            'id': 'ip',
            'type': 'text',
            'rule': [
              reg.required,
              reg.ip
            ],
            'name': 'IP地址',
            'increment' (val) {
              return ip(val).add(1).val()
            }
          },
          {
            'name': '操作',
            'btnCol': !0
          }
        ],
        colVis: [[0, 40], [1, 359], [2, 100]]
      },
      etIpRange: {
        prefix: 'ipRange',
        column: [
          {
            'id': 'i',
            'name': '序号',
            'drag': !1
          },
          {
            'id': 'startIp',
            'type': 'text',
            'rule': [
              {
                validator (rule, value, callback) {
                  let attr = rule.field.replace('start', 'end')
                  me.getForm()
                    .resetField(
                      attr,
                      getValue(attr, me.model)
                    )
                  callback()
                },
                trigger: _TRIGGER_
              },
              reg.required,
              reg.ip
            ],
            'name': '起始IP',
            'increment' (val) {
              return ip(val).add(256).val()
            }
          },
          {
            'id': 'endIp',
            'type': 'text',
            'rule': [
              reg.required,
              reg.ip,
              {
                validator (rule, value, callback) {
                  let ipReg = reg.ip.pattern
                  let startIp = getValue(rule.field.replace('end', 'start'), me.model)
                  let endIp = value

                  if (!startIp) {
                    callback(new Error('请输入开始地址'))
                  } else if (!ipReg.test(startIp)) {
                    callback(new Error('开始地址格式不正确'))
                  } else if (getIp3(startIp) !== getIp3(endIp)) {
                    callback(new Error('开始地址和结束地址不在同一地址段'))
                  } else {
                    let len = ip(endIp).sub(startIp)
                    if (len < 0) {
                      callback(new Error('结束地址不能小于开始地址'))
                    } else {
                      callback()
                    }
                  }
                },
                trigger: _TRIGGER_
              }
            ],
            'name': '结束IP',
            'increment' (val) {
              return ip(val).add(256).val()
            }
          },
          {
            'name': '操作',
            'btnCol': !0
          }
        ],
        colVis: [[0, 40], [1, 250], [2, 250], [3, 100]]
      }
    }
  },
  computed: {
    jtable () {
      return this.closest('jtable')
    },
    fields () {
      return formatFinal(fieldFactory(this), final, this.option)
    }
  },
  created () {
    this.setData(this.defModel = extend(true, modelTpl(this.fields), staticModel, {
      orgId: []
    }))
  },
  methods: {
    isMe () {
      return false
    },
    disEditTable () {
      let type = this.isMe() ? '' : 'text'
      let list = ['etMac', 'etIp', 'etIpRange']
      each(list, (name) => {
        let cols = this[name]['column']
        for (let i = 1; i < cols.length - 1; i++) {
          cols[i]['type'] = type
        }
      })
      this.$nextTick(() => {
        $(
          [
            'div.edit button',
            'div.addBtn button',
            'div.form-item-roleIds button'
          ].join(), this.$el
        )
          .prop(
            'disabled', this.isMe()
          )[this.isMe() ? 'addClass' : 'removeClass']('is-disabled')
      })
    },
    ApiPrefix () {
      return ApiPrefix(this.nodeId)
    },
    editPermit () {
      return this
        .$refs.formFactory
        .$refs.editPermit
    },
    getFormValue () {
      let fields = this.fields
      let model = this.model
      let map = {}

      each(fields, (filed) => {
        if (filed.name) {
          map[filed.name] = model[filed.name]
        }
      })

      if (model.id) {
        map.id = model.id
        map.updateWay = 0
      } else {
        map.status = 1
        map.onlineStatus = 0
      }

      if (model.orgId) {
        map.orgId = destroyCascadeValue(model.orgId)
      }

      if (!model.maxWay) {
        map.maxWay = '-1'
      }

      if (model.password) {
        map.password = MD5(model.password)
        map.rawPassword = encoder(model.password)
      } else {
        delete map.password
      }

      if (model.timerRange) {
        map.startTime = model.timerRange[0].getTime()
        map.endTime = model.timerRange[1].getTime()
      }

      let safeMac = []
      if (model.safeMac) {
        each(model.safeMac, (obj) => {
          safeMac.push(obj.safeMac)
        })
      }

      let safeIp = []
      if (model.ip) {
        each(model.ip, (obj) => {
          safeIp.push(obj.ip)
        })
      }
      if (model.ipRange) {
        each(model.ipRange, (obj) => {
          safeIp.push([obj.startIp, obj.endIp].join('-'))
        })
      }

      map.safeMac = json2str(safeMac)
      map.safeIp = json2str(safeIp)
      map.videoLimit = json2str(model.videoLimit)

      map.permitRepeatLogin = model.permitRepeatLogin.length > 0 ? 1 : 0

      delete map.timerRange

      return map
    },
    setData (model, callback) {
      let me = this
      initForm({
        model,
        ajax: [
          [Service.allGroup, me.ApiPrefix()],
          [
            Service.getUser,
            {
              id: model.id
            },
            me.ApiPrefix(),
            'put'
          ]
        ],
        events: [
          (r) => {
            me.option = {
              orgId: {
                name: 'name',
                value: 'id',
                list: array2tree(r[0].data.list, 'id', 'parentId').list
              }
            }
          },
          {
            method: 'put',
            fn: (r) => {
              me.data = r[1].data.object
              delete me.data.password
            }
          },
          () => {
            me.$nextTick(() => {
              fire(callback, me.data)
            })
          }
        ]
      })
    },
    open (data) {
      this.model = extend({}, this.defModel, {
        id: data.id,
        type: data.type,
        nodeId: this.nodeId = data.nodeId,
        roleIds: data.roleIds ? data.roleIds[0] : ''
      })
      this.dialog.open(() => {
        this.setData(data, (data) => {
          let obj = {
            id: data.id,
            nodeId: data.nodeId
          }
          if (obj.id) {
            copyValue(obj, data, this.fields)
            let attr = [
              ['ip', []],
              ['ipRange', []],
              ['safeIp', []],
              ['safeMac', []],
              ['videoLimit', {}],
              ['fingerCheck', !1],
              ['fingerVein', {}]
            ]
            attr.forEach((attr) => {
              obj[attr[0]] = data[attr[0]] || attr[1]
            })
            if (data.startTime) {
              obj.timerRange = [new Date(data.startTime), new Date(data.endTime)]
            }
            if (data.safeMac) {
              obj.safeMac = map(str2json(data.safeMac), (id) => {
                return { safeMac: id }
              })
            }
            if (data.maxWay === -1) {
              obj.maxWay = ''
            }
            if (data.safeIp) {
              map(str2json(data.safeIp), (ip) => {
                if (ip.indexOf('-') > 0) {
                  let list = ip.split('-')
                  obj.ipRange.push({
                    startIp: list[0],
                    endIp: list[1]
                  })
                } else {
                  obj.ip.push({
                    ip
                  })
                }
              })
            }
            if (data.videoLimit) {
              obj.videoLimit = extend(defVideoLimit(), str2json(data.videoLimit))
            }
            /**
               * 重新赋值 recordFlag 转化为 el-select 可用的 [String,...] 类型
               * */
            obj.permitRepeatLogin = ('' + data.permitRepeatLogin) === '1' ? ['1'] : []
            obj.orgId = createCascadeValue(obj.orgId, this.option.orgId.list)
          } else {
            obj = modelTpl(this.fields, this.option, extend({
              orgId: this.data.orgId
            }, staticModel))
          }

          this.model = extend({}, obj)
          this.disEditTable()
          this.dialog.end()

          this.$nextTick(() => {
            this.editPermit().init()
          })
        })
      })
    },
    saveAjax () {
      this.start(() => {
        let model = this.getFormValue()
        persist(model, 'addUser', 'editUser', this.ApiPrefix()).then((r) => {
          this.model.id = this.data.id || r.data.id
          this.editPermit().submit(() => {
            this.msg(r)
          })
          this.close()
          this.jtable.init()
        }).finally(this.end)
      })
    }
  }
}
</script>

<style lang="less">
  .org-user {
    .el-form {
      padding: 25px 20px 120px 20px;
    }

    .form-title {
      height: 40px;
      line-height: 40px;
      text-indent: 20px;
      border-bottom: 1px solid #e1e1e1;
      border-top: 1px solid #e1e1e1;
      margin: 20px -20px;
      background-color: #f5f7fa;
    }

    .edit-permit {
      height: 660px;
    }

    .el-form-item__label {
      width: 160px !important;
    }

    .el-form-item__content {
      margin-left: 160px !important;

      > .el-input {
        width: 300px;

        &.el-date-editor {
          width: 350px;
        }
      }
      .el-textarea {
        width: 500px;
      }
    }
  }
</style>
