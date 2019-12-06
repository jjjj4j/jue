<template>
  <div class="md5">
    <div>
      <input type="text" v-model="md5"/>
      <div>md5加密: {{md5Text}}</div>
    </div>
    <div>
      <input type="text" v-model="psw"/>
      <div>密码强度检测: {{pswText}}</div>
    </div>
    <div>
      <input type="text" v-model="base64"/>
      <div>base64加密: {{base64Text}}</div>
    </div>
  </div>
</template>

<script>
import { MD5 } from '@/util/md5'
import { score } from '@/util/psw'
import { encoder } from '@/util/base64'

export default {
  data () {
    return {
      md5: '123456',
      psw: '123456',
      base64: '123456',
      json: {
        a: 1,
        children: [{
          b: 2,
          children: [{
            c: 4
          }]
        }]
      }
    }
  },
  computed: {
    md5Text () {
      return MD5(this.md5)
    },
    pswText () {
      return score(this.psw)
    },
    base64Text () {
      return encoder(this.base64)
    }
  }
}
</script>
<style lang="less">
  .md5 {
    &> div {
      margin-bottom: 20px;

      div> {
        margin-top: 10px;
        font-size: 12px;
      }
    }
  }
</style>
