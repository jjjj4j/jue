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
import Service from '@/service/controller'

import {
  copyValue,
  createCascadeValue,
  destroyCascadeValue,
  formatFinal,
  initForm,
  modelTpl,
  persist
} from '@/util/form'
import { extend, fire } from '@/util/core'
import { array2tree, each, le4Tree } from '@/util/array'

export default {
  name: 'edit-form',
  mixins: [formFactoryMixin],
  computed: {
    jtree () {
      return this.closest('jtree')
    },
    jtable () {
      return this.closest('jtable')
    },
    fields () {
      return formatFinal(fieldFactory(this), null, this.option)
    }
  },
  created () {
    this.setData(this.defModel = extend(true, modelTpl(this.fields), {
      parentId: []
    }))
  },
  methods: {
    setData (model, callback) {
      let me = this
      let id = model.id

      initForm({
        model,
        ajax: [
          [Service.allGroup],
          [Service.getGroup, { id }, 'put']
        ],
        events: [
          (r) => {
            let list = array2tree(r[0].data.list, 'id', 'parentId').list
            let removeCurrentNode = (list) => {
              each(list, (obj, i) => {
                if (obj.id === id) {
                  list.splice(i, 1)
                  return !1
                }
                if (obj.children) {
                  removeCurrentNode(obj.children)
                }
              })
            }

            if (id) {
              removeCurrentNode(list)
            }
            list.unshift({
              id: '00000000-0000-0000-0000-000000000000',
              name: '无'
            })
            me.option = {
              parentId: {
                name: 'name',
                value: 'id',
                list
              }
            }
          },
          {
            method: 'put',
            fn: (r) => {
              me.data = r[1].data.object
            }
          },
          {
            method: 'post',
            fn: (r) => {
              me.data = model
              model.parentId = createCascadeValue(model.parentId, this.option.parentId.list)
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
          let obj = {
            id: data.id
          }
          if (data.id) {
            copyValue(obj, data, this.fields)
            obj.parentId = createCascadeValue(obj.parentId, this.option.parentId.list)
          } else {
            obj = modelTpl(this.fields, {
              parentId: data.parentId
            })
          }
          this.model = extend(true, {}, obj)

          this.dialog.end()
        })
      })
    },
    getFormValue () {
      let model = extend({}, this.model)
      if (model.parentId) {
        model.parentId = destroyCascadeValue(model.parentId)
      }
      return model
    },
    saveAjax () {
      this.start(() => {
        let model = this.getFormValue()
        persist(model, 'addGroup', 'editGroup').then((r) => {
          let node = extend({
            id: r.data.id,
            pId: model.parentId
          }, model)

          this.jtree.addNode(node)

          if (!this.data.id && le4Tree(this.jtree.list) === 1) {
            this.jtree.setActive(node)
            this.$parent.root = node
          }

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
  .res-group {
    .el-form {
      padding: 50px 20px 20px;
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
