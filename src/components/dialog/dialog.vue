<template>
  <transition name="dialog">
    <div class="model-dialog" :style="zIndex()" v-if="visible">
      <div :style="style()">
        <p v-if="title">
          <span>{{title}}</span>
          <a title="关闭" class="pull-right el-icon-close" @click="close()"></a>
        </p>
        <div v-loading="loading">
          <slot></slot>
        </div>
      </div>
    </div>
  </transition>
</template>
<script>
import { fire, isNumber } from '@/util/core'
import { last, push, remove } from '@/util/array'

let zIndex = 1033
let active, cache = []
$(window).bind('keyup.esc', (e) => {
  if (e.keyCode === 27) {
    active = last(cache)
    if (active) {
      active.close()
    }
  }
})

export default {
  name: 'i-dialog',
  data () {
    return {
      visible: !1,
      loading: !0
    }
  },
  props: {
    title: String,
    top: { type: [String, Number], default: 100 },
    width: { type: [String, Number], default: 600 },
    height: { type: [String, Number], default: 'auto' }
  },
  methods: {
    zIndex () {
      return {
        zIndex: ++zIndex
      }
    },
    style () {
      let { top, width, height } = this
      let left

      if (isNumber(top)) {
        top = top + 'px'
      }

      if (isNumber(width)) {
        left = `calc(50% - ${width / 2}px)`
        width = width + 'px'
      } else {
        left = `calc(50% - ${width} / 2)`
      }

      if (isNumber(height)) {
        height = height + 'px'
      }

      return { top, left, width, height }
    },
    /* 开始加载动画 */
    start (event) {
      this.loading = !0
      fire.call(this, event)
    },
    /* 结束加载动画 */
    end (event) {
      fire.call(this, event)
      setTimeout(() => {
        this.loading = !1
      }, 200)
    },
    callBack (event) {
      this.visible = !0
      this.$nextTick(() => {
        fire.call(this, event)
        this.$emit('open')
      })
    },
    sync (event) {
      this.loading = !1
      this.callBack(event)
    },
    open (event) {
      push(cache, this)
      this.start(() => {
        this.callBack(event)
      })
    },
    close (event) {
      remove(cache, this)
      this.visible = !1
      this.$nextTick(() => {
        fire.call(this, event)
        this.$emit('close')
      })
    }
  }
}
</script>
<style lang="less">
  .model-dialog {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom:0;
    z-index: 1033;
    overflow: hidden;

    > div {
      position: relative;
      min-width: 300px;
      min-height: 100px;
      background: #fff;
      overflow: hidden;
      box-shadow: 6px 6px 25px 0 #ddd;
      z-index: 999;

      > p {
        height: 30px;
        margin: 0;
        padding-left: 10px;
        font-size: 14px;
        line-height: 30px;
        text-align: left;
        color: #fff;
        background: #555;

        > span {
          position: relative;
        }

        > a {
          width: 30px;
          height: 30px;
          padding: 8px;
          cursor: pointer;

          &:hover {
            font-weight: 700;
          }
        }
      }

      > div {
        position: absolute;
        top: 30px;
        width: 100%;
        height: ~'calc(100% - 30px)';
        overflow: auto;
      }
    }

    .el-loading-mask {
      background-color: rgba(255, 255, 255, 0.5) !important;
    }
  }

  .dialog-enter {
    opacity: 0;
    transform: translateY(800px);
  }

  .dialog-enter-active {
    opacity: 1;
    transition: all .2s ease;
  }

  .dialog-leave {
    opacity: 1;
  }

  .dialog-leave-active {
    opacity: 0;
    transition: all .5s ease;
    transform: translateY(800px);
  }
</style>
