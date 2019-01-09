<template>
  <div id="app">
    <div class="ui-left">
      <router-link to="/ajax">Ajax</router-link>
      <router-link to="/tree">Tree</router-link>
      <router-link to="/browser">Browser</router-link>
      <router-link to="/md5">MD5 & PSW & BASE64</router-link>
      <router-link to="/factory-render">FactoryRender</router-link>
      <router-link to="/form">FormRender</router-link>
      <router-link to="/keyboard">Keyboard</router-link>
      <router-link to="/scrollbar">ScrollBar</router-link>
      <router-link to="/date-time">DateTime</router-link>
      <router-link to="/dialog">Dialog</router-link>
      <router-link to="/upload">FileUpload</router-link>
      <router-link to="/web-sql">Web SQL</router-link>
      <router-link to="/jtree">树(基础)</router-link>
      <router-link to="/jtree-0">树(基础-勾选)</router-link>
      <router-link to="/jtree-1">树(ajax)</router-link>
      <router-link to="/jtree-2">树(ajax-勾选)</router-link>
      <router-link to="/jtree-3">树(3级结构)</router-link>
      <router-link to="/jtable">表格(基础) </router-link>
      <router-link to="/jtable-0">表格(基础-子项)</router-link>
      <router-link to="/jtable-1">表格(树)</router-link>
      <router-link to="/jtable-2">表格(树-ajax子项)</router-link>
      <router-link to="/edit-table">可编辑表格</router-link>
    </div>
    <router-view class="ui-center"></router-view>
  </div>
</template>

<style lang="less">
  @import "../less/core";

  html, body {
    width: 100%;
    height: 100%;
    padding: 0;
    margin: 0;
    color: #2c3e50;
    font-family: "Microsoft Yahei", "Helvetica Neue", Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  #app {
    width: 100%;
    height: 100%;
  }

  .ui-left {
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    width: 200px;
    padding: 20px;
    font-size: 12px;
    box-sizing: border-box;
    background-color: #232a31;
  }

  .ui-left a {
    position: relative;
    display: block;
    padding: 3px 10px;
    color: #eee;
    font-weight: 400;
    text-decoration: none;
    &:hover{
      color: #fff;
    }
  }

  .ui-center {
    height: 100%;
    padding: 20px;
    margin-left: 200px;
  }

  .router-link-active{
    color: #fff!important;
  }

  .router-link-active:before {
    content: '';
    position: absolute;
    top: 7px;
    left: 0;
    bottom: 4px;
    border: 1px solid #fff;
    border-radius: 15px;
    z-index: 2;
  }
</style>
