<template>
  <div class="demo-upload">
    <el-button @click="open0">默认</el-button>
    <el-button @click="open1">制定义</el-button>
    <el-button @click="open2">全屏</el-button>
    <i-dialog ref="dialog0" :title="title">
      <p>这是一段话</p>
    </i-dialog>
    <i-dialog ref="dialog1" height= "50%" :width="700" :title="title">
      <p>这是一段话</p>
    </i-dialog>
    <i-dialog ref="dialog2" top="0" height= "100%" width="100%" :title="title">
      <p>这是一段话</p>
    </i-dialog>
  </div>
</template>
<script>
import IDialog from '@/components/dialog'

export default {
  name: 'demo-dialog',
  components: { IDialog },
  data () {
    return {
      title: 'Dialog'
    }
  },
  methods: {
    open0 () {
      this.$refs.dialog0.open(function () {
        this.end()
      })
    },
    open1 () {
      this.$refs.dialog1.open(function () {
        this.end()
      })
    },
    open2 () {
      this.$refs.dialog2.open(function () {
        this.end()
      })
    }
  }
}
</script>
<style lang="less">

</style>
