<template>
  <optiscroll ref="ops"
              :style="{height: getIndex().length > 7 ? (257 + 'px') : (getIndex().length * 34 + 12 + 'px')}"
              :step="34"
              :autoUpdate="false"
              :realTimeRendering="true"
              :contentHeight="contentHeight" @scroll="scrollEvent"
              v-show="getIndex().length > 0">
    <el-scrollbar
        tag="ul"
        wrap-class="el-select-dropdown__wrap"
        view-class="el-select-dropdown__list"
        ref="scrollbar">
      <slot></slot>
      <el-option
          :key="item.value"
          :value="item.value"
          :label="item.label"
          v-for="item in blockList"></el-option>
    </el-scrollbar>
  </optiscroll>
</template>

<script>
import ElScrollbar from 'element-ui/packages/scrollbar'
import ElOption from '@/elext/select/src/option'
import { each, splice } from '@/util/array'
import { AutoIncrementID, isDefined, isFunction } from '@/util/core'

const step = 7
const nodeHeight = 34

export default {
  inject: ['select'],
  components: {
    ElOption,
    ElScrollbar
  },
  data () {
    this.id = AutoIncrementID('SelectScrollbar')
    this.normalIndex = []
    this.searchIndex = []
    return {
      search: '',
      normalTop: 0,
      searchTop: 0
    }
  },
  computed: {
    scrollTop: {
      get () {
        return this.isSearch(() => this.searchTop, () => this.normalTop)
      },
      set (top) {
        this.isSearch(() => {
          this.searchTop = top
        }, () => {
          this.normalTop = top
        })
      }
    }
  },
  watch: {
    'search' (val) {
      if (val) {
        let reg = new RegExp(String(val).replace(/(\^|\(|\)|\[|\]|\$|\*|\+|\.|\?|\\|\{|\}|\|)/g, '\\$1'), 'i')
        let result = splice(this.getIndex())
        each(this.select.options, (item) => {
          if (reg.test(item.label)) {
            result.push(item)
          }
        })
        this.select.filteredOptionsCount = result.length
        this.normalTop = 0
      }
      this.draw(true)
    },
    'select.options' () {
      splice(this.normalIndex)
      each(this.select.options, (item) => {
        item.currentLabel = item.label
        item.visible = true
        this.normalIndex.push(item)
      })
      this.select.optionsCount = this.normalIndex.length
      this.select.setSelected()
    },
    'select.isHide' (value) {
      if (value === true) {
        this.draw(true)
      }
    }
  },
  methods: {
    query (val) {
      if (val !== this.search) {
        this.search = val
      }
    },
    scrollEvent (e) {
      this.draw(this.scrollTop = e.scrollTop)
    },
    contentHeight () {
      return this.getIndex().length > 1 ? this.getIndex().length * 34 + 19 : 46
    },
    handleScroll () {
      let val = this.select.value
      if (val) {
        let indexList = this.getIndex()
        each(indexList, (item, index) => {
          if (item.value === val) {
            let scrollTop = this.scrollTop
            let selectIndex = ~~(scrollTop / nodeHeight)

            if (selectIndex >= index) {
              this.$refs.ops.scrollTo(0, 34 * index + 6)
            } else if (index > selectIndex + step) {
              this.$refs.ops.scrollTo(0, 34 * (index - 6) + 6)
            }
            return false
          }
        })
      }
    },
    isSearch (success = () => !0, fail = () => !1) {
      if (this.search) {
        return success.call(this)
      }
      return fail.call(this)
    },
    get (cache, cache2) {
      let flag = this.isSearch()
      let value = (v) => {
        return isFunction(v) ? v() : v
      }
      return value(flag ? cache2 : cache)
    },
    set (obj, attr, attr2, value, isAll) {
      if (isAll) {
        obj[attr] = value
        obj[attr2] = value
      } else {
        this.get(() => {
          obj[attr] = value
        }, () => {
          obj[attr2] = value
        })
      }
      return obj
    },
    getIndex () {
      return this.get(this.normalIndex, this.searchIndex)
    },
    draw (top) {
      let indexList = this.getIndex()
      let scrollTop = this.scrollTop
      let index = ~~(scrollTop / nodeHeight)

      if (isDefined(top)) {
        if (top !== true) {
          scrollTop = this.scrollTop = top
        }
      }
      splice(
        this.blockList = this.blockList || [],
        each(indexList.slice(index, index + step), (node) => {
          node.j = index++
        })
      )

      this.$forceUpdate()

      if (top === true) {
        this.$nextTick(() => this.$refs.ops.update())
      }
    }
  }
}
</script>
