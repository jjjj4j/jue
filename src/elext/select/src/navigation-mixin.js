import { each } from '@/util/array'

export default {
  data () {
    return {
      hoverOption: -1
    }
  },

  computed: {
    optionsAllDisabled () {
      return this.lightSpeed ? false : this.options.filter(option => option.visible).every(option => option.disabled)
    }
  },

  watch: {
    hoverIndex (val) {
      if (this.lightSpeed && this.hoverOption) {
        delete this.hoverOption.hover
      }
      if (typeof val === 'number' && val > -1) {
        this.hoverOption = this.getOptionByIndex(val) || {}
      }
      if (this.lightSpeed) {
        this.hoverOption.hover = true
        this.scrollbar.$children.forEach(option => {
          let options = option.$children[0].$children
          each(options, (option) => {
            option.hover = this.hoverOption.value === option.value
          })
        })
      } else {
        this.options.forEach(option => {
          option.hover = this.hoverOption === option
        })
      }
    }
  },

  methods: {
    navigateOptions (direction) {
      if (!this.visible) {
        this.visible = true
        return
      }
      if (this.options.length === 0 || this.filteredOptionsCount === 0) return
      if (!this.optionsAllDisabled) {
        if (direction === 'next') {
          this.hoverIndex++
          if (this.hoverIndex === this.options.length) {
            this.hoverIndex = 0
          }
        } else if (direction === 'prev') {
          this.hoverIndex--
          if (this.hoverIndex < 0) {
            this.hoverIndex = this.options.length - 1
          }
        }
        const option = this.getOptionByIndex(this.hoverIndex)
        if (option.disabled === true ||
          option.groupDisabled === true ||
          !option.visible) {
          this.navigateOptions(direction)
        }
        this.$nextTick(() => {
          if (this.lightSpeed) {
            let nodeHeight = 34
            let scrollTop = this.scrollbar.scrollTop
            let index = ~~(scrollTop / nodeHeight)
            
            if (index >= this.hoverIndex) {
              this.scrollbar.$refs.ops.scrollTo(0, 34 * this.hoverIndex + 6)
            } else if (this.hoverIndex >= index + 6) {
              this.scrollbar.$refs.ops.scrollTo(0, 34 * (this.hoverIndex - 6) + 6)
            }
          } else {
            this.scrollToOption(this.hoverOption)
          }
        })
      }
    }
  }
}
