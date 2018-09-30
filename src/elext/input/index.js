import ElInput from 'element-ui/packages/input/index.js'
import { isIE9 } from '@/util/browser'
import Vue from 'vue'

export default {
  extends: ElInput,
  render ($$) {
    let $input = this.$options.extends.render.call(this, $$)
    let index = this.type === 'textarea' ? 0 : 1
    $input.children[index].data.on.keyup = this.handleKeyup
    return $input
  },
  methods: {
    handleKeyup (event) {
      let value = event.target.value
      // 修复 IE9 'input' 事件无监听 'Backspace' 键的 Bug
      if (isIE9) {
        if ([8, 46].indexOf(event.which) >= 0) {
          this.$emit('input', value)
          this.setCurrentValue(value)
        }
      }
      this.$emit('keyup', value)
    }
  },
  install () {
    Vue.component(ElInput.name, this)
  }
}
