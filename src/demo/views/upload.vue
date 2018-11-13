<template>
  <div class="demo-upload">
    <component :action="action"
               :param="param"
               :importWay.sync="importWay"
               :hasImportWay="hasImportWay"
               @close="close"
               @success="success"
               :is="currentView"></component>
  </div>
</template>
<script>
import Upload from '@/components/upload/upload'
import UploadIE9 from '@/components/upload/upload-ie9'
import { isIE9 } from '@/util/browser'
import { tpl } from '@/util/char'

export default {
  name: 'demo-upload',
  components: { Upload, UploadIE9 },
  data () {
    return {
      title: 'user',
      param: {},
      importWay: 'append/',
      currentView: isIE9 ? 'UploadIE9' : 'Upload'
    }
  },
  props: {
    hasImportWay: {
      type: Boolean,
      default: !0
    },
    success: {
      type: Function,
      default () {
        console.log('success')
      }
    }
  },
  computed: {
    action () {
      return tpl('/npconfig/v1/{name}/import/excel', {
        name: this.name
      })
    }
  }
}
</script>
<style lang="less">

</style>
