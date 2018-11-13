import { scrollbarSpec } from './globals'
import { isNumber } from '@/util/core'

export default {
  props: {
    width: {
      type: [String, Number],
      default: '100%'
    },
    height: {
      type: [String, Number],
      default: 41
    }
  },
  computed: {
    rtl () { return this.$parent.rtl },
    classPrefix () { return this.$parent.classPrefix }
  },
  render ($$) {
    let { $slots, width, height, classPrefix, rtl } = this
    let $root = {
      style: {
        width: isNumber(width) ? width + 'px' : width,
        height: isNumber(height) ? height + 'px' : height
      },
      class: [classPrefix + 'fix']
    }
    let $content = { class: [classPrefix + 'content', 'real-time'] }
    let size = scrollbarSpec.width
  
    if (size) {
      if (size === 0) {
        $content.class.push('data-scroll')
      } else {
        $content.style = {
          [rtl ? 'left' : 'right']: -size + 'px',
          bottom: -size + 'px'
        }
      }
    }
    
    return $$('div', $root, [$$('div', $content, [$slots.default])])
  }
}
