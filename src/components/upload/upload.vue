<template>
  <div class="upload">
    <h3>
      <i class="ico ico-upload"></i>
      步骤二： 请导入填写完成的 EXCEL 表格
    </h3>
    <el-upload
        drag
        ref="upload"
        class="file-upload"
        :data="param"
        :class="{
          'hide-upload': isHideUpload,
          'is-timeout': isTimeout,
          'is-uploaded': isUploaded && ajaxing
        }"
        :accept="accept"
        :action="action"
        :fileList="fileList"
        :multiple="!1"
        :auto-upload="!1"
        :with-credentials="!0"
        :on-remove="removeEvent"
        :on-change="changeEvent"
        :on-error="handleError"
        :on-progress="progressEvent"
        :on-success="handleSuccess"
        :http-request="ajax"
        :before-upload="beforeUpload">
      <i class="el-icon-upload"></i>
      <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
    </el-upload>
    <div v-if="hasImportWay">
      <el-radio class="radio" v-model="importWay" label="append/">追加</el-radio>
      <el-radio class="radio" v-model="importWay" label="override/">覆盖</el-radio>
    </div>
    <div class="btns">
      <el-button class="btn2" size="small" type="primary" :disabled="!isHideUpload || ajaxing" @click="save">上传
      </el-button>
      <el-button class="btn2" size="small" @click="close">取消</el-button>
    </div>
  </div>
</template>
<script>
function getError (action, option, xhr) {
  let msg
  if (xhr.response) {
    msg = `${xhr.status} ${xhr.response.error || xhr.response}`
  } else if (xhr.responseText) {
    msg = `${xhr.status} ${xhr.responseText}`
  } else {
    msg = `fail to post ${action} ${xhr.status}`
  }

  const err = new Error(msg)
  err.status = xhr.status
  err.method = 'post'
  err.url = action
  return err
}

function getBody (xhr) {
  const text = xhr.responseText || xhr.response
  if (!text) {
    return text
  }

  try {
    return JSON.parse(text)
  } catch (e) {
    return text
  }
}

export default {
  data () {
    return {
      accept: '.xls,.xlsx',
      ajaxing: !1,
      isTimeout: !1,
      isHideUpload: !1,
      isUploaded: !1,
      fileList: []
    }
  },
  props: {
    param: Object,
    action: String,
    importWay: String,
    hasImportWay: Boolean
  },
  watch: {
    importWay (v) {
      this.$emit('update:importWay', v)
    }
  },
  methods: {
    ajax (option) {
      if (typeof XMLHttpRequest === 'undefined') {
        return
      }
      let me = this
      const xhr = new XMLHttpRequest()
      const action = option.action

      xhr.timeout = 3600000
      xhr.ontimeout = (e) => {
        me.isTimeout = !0
        me.msg('数据太大,请求已超时')
      }
      if (xhr.upload) {
        xhr.upload.onprogress = function progress (e) {
          if (e.total > 0) {
            e.percent = e.loaded / e.total * 100
          }
          option.onProgress(e)
        }
      }

      const formData = new FormData()

      if (option.data) {
        Object.keys(option.data).map(key => {
          formData.append(key, option.data[key])
        })
      }

      formData.append(option.filename, option.file)

      xhr.onerror = function error (e) {
        option.onError(e)
      }

      xhr.onload = function onload () {
        if (xhr.status < 200 || xhr.status >= 300) {
          return option.onError(getError(action, option, xhr))
        }

        option.onSuccess(getBody(xhr))
      }

      xhr.open('post', action, true)

      if (option.withCredentials && 'withCredentials' in xhr) {
        xhr.withCredentials = true
      }

      const headers = option.headers || {}

      for (let item in headers) {
        if (headers.hasOwnProperty(item) && headers[item] !== null) {
          xhr.setRequestHeader(item, headers[item])
        }
      }
      xhr.send(formData)
      return xhr
    },
    removeEvent (file, fileList) {
      this.ajaxing = !1
      this.isTimeout = !1
      this.isUploaded = !1
      this.isHideUpload = fileList.length > 0
    },
    changeEvent (file, fileList) {
      this.ajaxing = !1
      this.isTimeout = !1
      this.isUploaded = !1
      this.isHideUpload = fileList.length > 0
    },
    handleError (r) {
      let code = r.status
      let data = $.str2json($.trim(r.message.replace(code, '')))
      let message = data.message
      this.msg({
        code,
        message
      })
      this.isUploaded = !1
      this.ajaxing = !1
    },
    progressEvent (e) {
      if (e.percent === 100) {
        this.isUploaded = !0
      }
    },
    handleSuccess (r) {
      if (r.code === 200) {
        this.$emit('success', this.$parent, r.data)
      } else {
        this.$refs.upload.clearFiles()
      }
      this.msg(r)
      this.isUploaded = !1
      this.ajaxing = !1
    },
    beforeUpload (file) {
      let regs = this.accept.split(',').map(function (obj) {
        return new RegExp('\\' + $.trim(obj) + '$')
      })
      let flag = false
      for (let i = 0; i < regs.length; i++) {
        if (regs[i].test(file.name)) {
          flag = true
          break
        }
      }
      if (!flag) {
        this.$alert('文件' + file.name + ', 不符合文件格式要求。 请上传' + this.accept + '类型的文件。')
        return flag
      } else {
        this.ajaxing = !0
      }
    },
    close () {
      this.$emit('close')
    },
    save () {
      this.$refs.upload.submit()
    }
  }
}
</script>
<style lang="less">
  .upload {
    .btns {
      margin-top: 25px;
    }

    .file-upload {
      width: 100%;
      padding: 10px 0 20px;

      input[type="file"] {
        display: none;
      }

      &.hide-upload > .el-upload {
        display: none;
      }

      &.is-uploaded .el-progress__text {
        color: transparent;
        &:after {
          color: #97a8be;
          content: "数据解析中";
        }
      }

      &.is-timeout .el-progress__text {
        color: transparent;
        &:after {
          color: #ff5555;
          content: "连接超时";
        }
      }

      .el-upload-dragger {
        border-color: #555;

        &:hover {
          border-color: #20a0ff;
        }
      }

      .el-upload-list {
        width: 450px;

        > li {
          outline: 2px dashed #86C0E8;
          margin-bottom: 20px;

          &:hover {
            background-color: #ebf6fd;
          }

          > i {
            top: 18px;
            right: 10px;
            color: #00a2ff;
            z-index: 1033;
          }

          > a {
            position: relative;
            padding-left: 65px;
            line-height: 50px;
            z-index: 1033;
            background: url(/img/excel.png) 10px 0 no-repeat;

            > i {
              display: none;
            }
          }

          > div {
            top: 0;
            bottom: 0;

            .el-progress__text {
              top: 19px;
              right: 10px;
            }

            .el-progress-bar__outer {
              height: 50px !important;
              border-radius: 0;
              background-color: transparent;
            }

            .el-progress-bar__inner {
              border-radius: 0;
              background-color: #cbe9ff;
            }
          }
        }
      }
    }
  }
</style>
