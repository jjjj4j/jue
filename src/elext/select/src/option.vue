<template>
  <li
    @mouseenter="hoverItem"
    @mousemove="mouseEvent"
    @click.stop="selectOptionClick"
    class="el-select-dropdown__item"
    v-show="visible"
    :class="{
      'selected': itemSelected,
      'is-disabled': disabled || groupDisabled || limitReached,
      'hover': hover
    }">
    <slot>
      <span>{{ currentLabel }}</span>
    </slot>
  </li>
</template>

<script type="text/babel">
import Emitter from 'element-ui/src/mixins/emitter'
import { getValueByPath, escapeRegexpString } from 'element-ui/src/utils/util'
import { isDefined } from '@/util/core'

export default {
  mixins: [Emitter],

  name: 'ElOption',

  componentName: 'ElOption',

  inject: ['select'],

  props: {
    value: {
      required: true
    },
    lightSpeed: {
      type: Boolean,
      default () {
        return this.select.lightSpeed
      }
    },
    label: [String, Number],
    created: Boolean,
    disabled: {
      type: Boolean,
      default: false
    }
  },

  data () {
    let hover = false

    if (this.select.lightSpeed) {
      let option = this.select.getOption(this.value)
      if (isDefined(option.hover)) {
        hover = option.hover
      }
    }

    return {
      index: -1,
      groupDisabled: false,
      visible: true,
      hitState: false,
      hover
    }
  },

  computed: {
    isObject () {
      return Object.prototype.toString.call(this.value).toLowerCase() === '[object object]'
    },

    currentLabel () {
      return this.label || (this.isObject ? '' : this.value)
    },

    currentValue () {
      return this.value || this.label || ''
    },

    itemSelected () {
      if (!this.select.multiple) {
        return this.isEqual(this.value, this.select.value)
      } else {
        return this.contains(this.select.value, this.value)
      }
    },

    limitReached () {
      if (this.select.multiple) {
        return !this.itemSelected &&
            (this.select.value || []).length >= this.select.multipleLimit &&
            this.select.multipleLimit > 0
      } else {
        return false
      }
    }
  },

  watch: {
    currentLabel () {
      if (!this.created && !this.select.remote) this.dispatch('ElSelect', 'setSelected')
    },
    value (val, oldVal) {
      const { remote, valueKey } = this.select
      if (!this.created && !remote) {
        if (valueKey && typeof val === 'object' && typeof oldVal === 'object' && val[valueKey] === oldVal[valueKey]) {
          return
        }
        this.dispatch('ElSelect', 'setSelected')
      }
    }
  },

  methods: {
    isEqual (a, b) {
      if (!this.isObject) {
        return a === b
      } else {
        const valueKey = this.select.valueKey
        return getValueByPath(a, valueKey) === getValueByPath(b, valueKey)
      }
    },

    contains (arr = [], target) {
      if (!this.isObject) {
        return arr.indexOf(target) > -1
      } else {
        const valueKey = this.select.valueKey
        return arr.some(item => {
          return getValueByPath(item, valueKey) === getValueByPath(target, valueKey)
        })
      }
    },

    handleGroupDisabled (val) {
      this.groupDisabled = val
    },

    mouseEvent (e) {
      this.select.prevX = e.screenX
      this.select.prevY = e.screenY
    },

    hoverItem (e) {
      let { prevX, prevY } = this.select
      if (isDefined(prevX) && isDefined(prevY)) {
        if (prevX === e.screenX && prevY === e.screenY) {
          return false
        }
      }

      this.select.prevX = e.screenX
      this.select.prevY = e.screenY

      if (!this.disabled && !this.groupDisabled) {
        this.select.hoverIndex = this.select.getOptionIndex(this)
      }
    },

    selectOptionClick () {
      if (this.disabled !== true && this.groupDisabled !== true) {
        this.dispatch('ElSelect', 'handleOptionClick', [this, true])
      }
    },

    queryChange (query) {
      this.visible = new RegExp(escapeRegexpString(query), 'i').test(this.currentLabel) || this.created
      if (!this.visible) {
        this.select.filteredOptionsCount--
      }
    }
  },

  created () {
    if (!this.lightSpeed) {
      this.select.options.push(this)
      this.select.cachedOptions.push(this)
      this.select.optionsCount++
      this.select.filteredOptionsCount++
    }

    this.$on('queryChange', this.queryChange)
    this.$on('handleGroupDisabled', this.handleGroupDisabled)
  },

  beforeDestroy () {
    this.select.onOptionDestroy(this.select.options.indexOf(this))
  }
}
</script>
