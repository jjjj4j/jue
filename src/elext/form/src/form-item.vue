<script>
import FormItem from 'element-ui/packages/form/src/form-item'
import { getPropByPath } from 'element-ui/src/utils/util'
import { isUndefined } from '@/util/core'

export default {
  extends: FormItem,
  inject: ['cache'],
  watch: {
    prop (value) {
      let cache = this.cache[value]
      if (cache) {
        this.validateState = cache.validateState
        this.validateMessage = cache.validateMessage
      } else {
        let { validateState, validateMessage } = this
        this.cache[value] = {
          validateState, validateMessage
        }
      }
    }
  },
  methods: {
    val (model) {
      return this.property(model).v
    },
    property (model) {
      model = model || this.form.model
      if (!model || !this.prop) { return }
      let path = this.prop
      if (path.indexOf(':') !== -1) {
        path = path.replace(/:/, '.')
      }
      return getPropByPath(model, path, true)
    },
    resetField (initialValue) {
      this.validateState = ''
      this.validateMessage = ''
      this.validateDisabled = true

      let value = this.fieldValue
      let prop = this.property()

      if (isUndefined(initialValue)) {
        initialValue = this.initialValue
      }

      if (Array.isArray(value)) {
        prop.o[prop.k] = [].concat(initialValue)
      } else {
        prop.o[prop.k] = initialValue
      }

      this.broadcast('ElTimeSelect', 'fieldReset', initialValue)
    }
  }
}
</script>
