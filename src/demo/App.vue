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
    </div>
    <router-view class="ui-center"></router-view>
  </div>
</template>

<style lang="less">
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
    margin-left: 200px;
    padding: 20px;
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
