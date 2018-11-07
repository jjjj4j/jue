<template>
  <div class="browser">
    <ul>
      <li>当前浏览器版本</li>
      <li>isIE9: {{isIE9}}</li>
      <li>is4plugin: {{is4plugin}}</li>
      <li>browser: {{browser}}</li>
    </ul>
  </div>
</template>

<script>
import { isIE9, is4plugin, browser } from '@/util/browser'
import { json2str } from '@/util/json'

export default {
  data () {
    return {
      isIE9: isIE9,
      is4plugin: is4plugin,
      browser: json2str(browser)
    }
  }
}
</script>
