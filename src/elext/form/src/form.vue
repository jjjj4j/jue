<script>
import Form from 'element-ui/packages/form/src/form'

export default {
  name: 'ElForm',
  extends: Form,
  provide: () => ({ cache: [] }),
  watch: {
    model (value) {
      this.resetFields(value)
    }
  },
  methods: {
    resetField (name, value) {
      if (name) {
        this.fields.forEach(field => {
          if (field.prop === name) {
            return !!field.resetField(value)
          }
        })
      }
    },
    resetFields (data) {
      if (!this.model) {
        console.warn('[Element Warn][Form]model is required for resetFields to work.')
        return
      }
      this.fields.forEach(field => {
        field.resetField(data && field.val(data))
      })
    }
  }
}
</script>
