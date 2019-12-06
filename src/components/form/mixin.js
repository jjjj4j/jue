import { formFactoryRender } from '@/util/render'
import { fire } from '@/util/core'

export default {
  data () {
    return {
      model: {},
      loading: !1
    }
  },
  props: {
    title: String
  },
  computed: {
    dialog () {
      return this.find('dialog')
    },
    renderInit () {
      return formFactoryRender.bind(this, this.fields, {})
    }
  },
  methods: {
    /* 开始加载动画 */
    start (callback) {
      this.loading = !0
      fire(callback)
    },
    /* 结束加载动画 */
    end (callback) {
      fire(callback)
      setTimeout(() => {
        this.loading = !1
      }, 200)
    },
    find (name) {
      return this.$refs[name]
    },
    closest (name, $parent = this.$parent) {
      if ($parent) {
        if ($parent.$refs[name]) {
          return $parent.$refs[name]
        } else {
          return this.closest(name, $parent.$parent)
        }
      }
    },
    getForm () {
      return this
        .$refs.formFactory
        .$refs.form
    },
    validate (success, fail, excluded) {
      this.getForm().validate((valid, errors) => {
        if (valid) {
          success && success.call(this)
        } else {
          fail && fail.call(this, errors)
          return false
        }
      }, excluded)
    },
    submit (event) {
      this.validate(this.saveAjax, (r) => {
        console.log(r)
      })
    },
    resetForm (data) {
      this.getForm().resetFields(data || this.defModel)
    },
    close () {
      this.dialog.close()
    }
  }
}
