<template>
  <div id="app">
    <div class="ui-top">
      <div class="logo">
        <i></i>
        <a>统一配置中心</a>
      </div>
      <ul>
        <li :class="{active: activeNav.includes(tab.path)}"
            @click="link(tab.path)" v-for="tab in tabs">
          <a>{{tab.name}}</a>
        </li>
      </ul>
    </div>
    <router-view class="ui-center"></router-view>
  </div>
</template>

<script>
import { go } from '@/util/url'
import { getIndexTitle } from '@/util/storage'

export default {
  name: 'app',
  data () {
    return {
      tabs: [
        { path: '/user', name: '用户' },
        { path: '/group', name: '分组' },
        { path: '/device', name: '设备' },
        { path: '/camera', name: '摄像机' }
      ]
    }
  },
  computed: {
    activeNav () {
      return this.$route.path
    }
  },
  methods: {
    link (path) {
      go(this.$router, path)
    }
  },
  mounted () {
    let title = getIndexTitle()
    if (title) {
      window.document.title = title
    }
  }
}
</script>

<style lang="less">
  @import "less/core";
  @import "less/sprite";

  @keyframes logo {
    from {
      opacity: 0.4;
      transform: rotate(0deg) scale(0.5, 0.5);
    }
    to {
      opacity: 1;
      transform: rotate(360deg) scale(1, 1);
    }
  }

  html, body {
    width: 100%;
    height: 100%;
    font-family: "Microsoft Yahei", "Helvetica Neue", Helvetica, Arial, sans-serif;
  }

  #app {
    width: 100%;
    min-width: 1000px;
    height: 100%;
    background-color: #fbfbfb;
  }

  .ui-top {
    position: relative;
    width: 100%;
    height: 50px;
    background-color: #2d87f9;

    .logo {
      width: 250px;
      display: inline-block;
      padding: 5px 25px;
      color: #fff;
      font-size: 18px;

      > i {
        width: 36px;
        height: 40px;
        position: absolute;
        top: 5px;
        animation: logo 5s;
        background: #2d87f9 url(/img/logo.png) 0 0 no-repeat;
      }

      a {
        font-weight: 400;
        line-height: 40px;
        padding-left: 50px;
        letter-spacing: 1px;
      }
    }

    .user, .logout {
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      color: #fff;
      font-size: 16px;
      line-height: 50px;
      text-align: center;
      cursor: pointer;
    }

    .user {
      padding: 0 20px;
      right: 51px;

      &:hover {
        background: #368fff;
        box-shadow: 0 0 68px 0px #0b6cea inset;
      }

      a {
        padding: 0 5px;
        font-size: 14px;
      }
    }

    .logout {
      width: 50px;

      &:before, &:after {
        content: "";
        position: absolute;
        top: 14px;
        bottom: 14px;
        width: 0.5px;
      }

      &:before {
        left: -1px;
        background-color: #2075d1;
      }

      &:after {
        left: 0;
        background-color: #72a9ff;
      }
    }

    > ul {
      margin: 0;
      display: inline-block;
      vertical-align: top;
      padding-left: 20px;

      li {
        position: relative;
        display: inline-block;
        padding: 0 20px;
        line-height: 50px;
        font-size: 14px;
        color: #fff;
        cursor: pointer;

        &.active {
          background-color: #137DE5;
        }
      }
    }
  }

  .ui-center {
    width: calc(~'100% - 40px');
    height: calc(~'100% - 90px');
    margin: 20px;
    border: 1px solid #eee;
    overflow: hidden;
  }

  .ui-center-content {
    width: 100%;
    height: calc(~'100% - 45px');
    padding: 20px;
    border-top: 1px solid #ddd;
    background-color: #fff;
  }

</style>
