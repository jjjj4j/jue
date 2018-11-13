<template>
  <div class="upload">
    <h3 v-if="hasFlash">
      <i class="ico ico-upload"></i>
      步骤二： 请导入填写完成的 EXCEL 表格
    </h3>
    <h3 v-else>
      <i class="ico ico-download"></i>
      步骤二： 请先下载并安装 Flash 插件，安装完成后需重新启动浏览器
    </h3>
    <div class="flash" v-if="!hasFlash">
      <div class="flash-download-context">
        <div class="msg"><h5>Adobe Flash Player</h5>
          <small>是一种广泛使用的、专有的多媒体程序</small>
          <br>
          <small style="line-height: 24px;">(安装完成后需重新启动浏览器)</small>
        </div>
        <a class="btn" href="/plugin/install_flash_player_ax.exe">立即下载</a></div>
    </div>
    <div v-else>
      <div class="upload-ie9">
        <div id="upload-ie9-queue"></div>
        <input id="upload-ie9" type="file"/>
      </div>
      <div v-if="hasImportWay">
        <el-radio class="radio" v-model="importWay" label="append/">追加</el-radio>
        <el-radio class="radio" v-model="importWay" label="override/">覆盖</el-radio>
      </div>
      <div class="btns">
        <el-button class="btn2" size="small" type="primary"
                   :disabled="!ajaxing"
                   @click="upload">上传
        </el-button>
        <el-button class="btn2" size="small" @click="close">取消</el-button>
      </div>
    </div>
  </div>
</template>
<script>
import { fire } from '@/util/core'

let flashVersion = (function () {
  let flashVer = NaN,
    swf,
    AXO = window.ActiveXObject

  if (AXO) {
    try {
      swf = new AXO('ShockwaveFlash.ShockwaveFlash')
    } catch (e) {
      return flashVer
    }
    if (swf) {
      flashVer = parseInt(swf.GetVariable('$version').split(' ')[1].replace(/,/g, '.').replace(/^(d+.d+).*$/, '$1'))
    }
  } else {
    if (navigator.plugins && navigator.plugins.length > 0) {
      try {
        swf = navigator.plugins['Shockwave Flash']
      } catch (e) {
        return flashVer
      }
      if (swf) {
        let arr = swf.description.split(' ')
        for (let i = 0, len = arr.length; i < len; i++) {
          let ver = Number(arr[i])

          if (!isNaN(ver)) {
            flashVer = ver
            break
          }
        }
      }
    }
  }
  return flashVer
})()

export default {
  data () {
    return {
      name: '',
      ajaxing: !1,
      hasFlash: !!flashVersion
    }
  },
  props: {
    param: Object,
    action: String,
    importWay: String,
    hasImportWay: Boolean
  },
  watch: {
    param (v) {
      this.$upload.uploadify('settings', 'formData', v)
    },
    action (v) {
      this.$upload.uploadify('settings', 'uploader', v)
    },
    importWay (v) {
      this.$emit('update:importWay', v)
    }
  },
  methods: {
    upload () {
      this.$upload.uploadify('upload', '*')
    },
    close () {
      this.$emit('close')
    }
  },
  mounted () {
    let me = this
    let $file = $('#upload-ie9')
    let $queue = $('#upload-ie9-queue')
    let close = (callback) => {
      $queue.removeClass('height0')
      $file.addClass('height0')
      fire(callback)
    }
    let open = () => {
      $file.removeClass('height0')
      $queue.addClass('height0')
      $file.uploadify('cancel', '*')
    }

    $file.uploadify({
      'queueSizeLimit': 1,
      'auto': !1,
      'queueID': 'upload-ie9-queue',
      'buttonText': '点击此处，选择上传文件',
      'fileObjName': 'file',
      'fileTypeExts': '*.xls; *.xlsx',
      'fileTypeDesc': '支持格式:xls,xlsx.',
      'swf': '/lib/uploadify/uploadify.swf',
      'uploader': me.action,
      'removeCompleted': false,
      'width': 360,
      'height': 180,
      'successTimeout': 3600,
      'formData': me.param,
      'onSelect' (file) {
        close(() => me.ajaxing = !0)
      },
      'onUploadStart' (file) {
        me.ajaxing = !1
      },
      'onClearQueue' (file, data, response) {
        me.ajaxing = !1
      },
      'onUploadSuccess' (file, data, response) {
        let r = $.str2json(data)
        if (r.code === 200) {
          me.$emit('success', me.$parent, r.data)
        }
        me.msg(r)
      },
      'onUploadError' (file, errorCode, code, message) {
        me.msg({
          code,
          message
        })
      }
    })
    $file = me.$upload = $('#upload-ie9')
    $queue.on('click', 'div.cancel', open)
  },
  destroyed () {
    this.$upload.uploadify('destroy')
  }
}
</script>
<style lang="less">
  .upload {
    .btns {
      margin-top: 25px;
      margin-bottom: 25px;
    }
  }

  .upload-ie9 {
    width: 450px;
    margin: 10px 0 20px;

    &:hover {
      .uploadify-button {
        color: #808ea3;
        border: 1px dashed #20a0ff;
      }
    }

    .height0 {
      height: 0 !important;
      > object {
        height: 0 !important;
      }
      > div {
        display: none;
      }
    }

    .uploadify {
      position: relative;

      .swfupload {
        top: 0;
        left: 0;
      }
    }

    .uploadify-button {
      position: relative;
      border: 1px dashed #555;
      border-radius: 6px;
      color: #97a8be;
      text-align: center;

      &:before {
        content: "\E60D";
        margin: 40px 0 16px;
        font: 67px/50px element-icons;
      }

      .uploadify-button-text {
        display: block;
        margin-top: -60px;
        font-size: 14px;
        line-height: 1;
      }
    }

    .uploadify-queue-item {
      position: relative;
      width: 100%;
      margin: 5px 0 20px 0;
      color: #48576a;
      font-size: 14px;
      line-height: 0 !important;
      outline: 2px dashed #86c0e8;

      &:hover {
        background-color: #ebf6fd;
        .cancel {
          display: block;
        }
      }

      &.uploadify-error {
        .data {
          color: #ff5d4d;
        }
      }

      .fileName,
      .data, & {
        position: relative;
        display: inline-block;
        line-height: 50px;
        z-index: 1033;
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
      }

      .fileName {
        max-width: 75%;
        padding-left: 65px;
        color: #48576a;
        background: url(/img/excel.png) 10px 0 no-repeat;
      }

      .data {
        font-size: 11px;
      }

      .cancel {
        display: none;
        position: absolute;
        top: 17px;
        right: 10px;
        z-index: 1034;

        a {
          color: #57b4ff;
          font: 400 15px Arial;
          text-decoration: none;
        }
      }

      .uploadify-progress {
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
      }

      .uploadify-progress-bar {
        width: 0;
        height: 100%;
        background-color: #cbe9ff;
      }
    }
  }

  .flash {
    position: relative;
    border: 1px dashed #555;
    border-radius: 6px;
    width: 360px;
    height: 180px;

    &:hover {
      border: 1px dashed #20a0ff;
    }

    .flash-download-context {
      .msg {
        margin: 0 auto;
        padding-left: 72px;
        width: 300px;
        background: #FFF url(/img/flash.png) no-repeat left center;
      }
      h5 {
        font-weight: 900;
        font-size: 16px;
        margin: 30px 0 10px;
      }
      small {
        color: #969696;
        font-weight: 400;
        font-size: 12px;
      }
      .btn {
        display: block;
        width: 150px;
        padding: 7px 15px;
        margin: 15px auto;
        border-radius: 2px;
        color: #fff;
        font-size: 12px;
        text-align: center;
        background-color: #91cd6c;
        text-decoration: none;
        white-space: nowrap;
        cursor: pointer;

        &:hover,
        &:active,
        &:focus {
          background-color: #83b265;
        }
      }
    }
  }
</style>
