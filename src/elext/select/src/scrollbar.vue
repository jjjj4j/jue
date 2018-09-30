<template>
  <optiscroll ref="ops"
              :style="{height: '406px'}"
              :step="10"
              :autoUpdate="false"
              :realTimeRendering="true"
              :contentHeight="contentHeight" @scroll="scrollEvent">
    <el-scrollbar
        tag="ul"
        wrap-class="el-select-dropdown__wrap"
        view-class="el-select-dropdown__list"
        ref="scrollbar">
      <slot></slot>
      <el-option :key="item.id" :value="item.name" v-for="item in data"></el-option>
    </el-scrollbar>
  </optiscroll>
</template>

<script>
import ElScrollbar from 'element-ui/packages/scrollbar'
import ElOption from '@/elext/select/src/option'

export default {
  inject: ['select'],
  props: {
    data: {
      type: Array,
      default () { return [] }
    }
  },
  components: {
    ElOption,
    ElScrollbar
  },
  computed: {
    instance () {
      return this.$parent
    }
  },
  watch: {
    data () {
      this.$refs.ops.update()
    },
    'select.isHide' (value) {
      if (value === true) {
        this.$refs.ops.update()
      }
    }
  },
  methods: {
    scrollEvent (e) {
      console.log(e)
    },
    contentHeight () {
      return this.data.length * 1000
    },
    handleScroll () {
      return this.$refs.scrollbar.handleScroll()
    }
  }
}
</script>
