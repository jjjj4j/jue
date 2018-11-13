import './optiscroll.css'
import {
  extend,
  isDefined,
  AutoIncrementID,
  fire
} from '@/util/core'
import { each } from '@/util/array'
import Timer from '@/util/Timer'
import Bar from './scrollbar.js'
import { instances, scrollbarSpec, isTouch, throttle } from './globals'

let scrollMinUpdateInterval = 1000 / 40
let checkFrequency = 1000
let pauseCheck = false
let checkTimer = null

function invoke (collection, fn) {
  each(collection, (instance) => instance[fn]())
}

function checkLoop () {
  if (!instances.length) {
    if (checkTimer) {
      checkTimer = checkTimer.destroy()
    }
    return checkTimer
  }
  if (!pauseCheck) { invoke(instances, 'update') }
}

export default {
  props: {
    realTimeRendering: { type: Boolean, default: false },
    preventParentScroll: { type: Boolean, default: false },
    forceScrollbars: { type: Boolean, default: false },
    scrollStopDelay: { type: Number, default: 300 },
    maxTrackSize: { type: Number, default: 95 },
    minTrackSize: { type: Number, default: 5 },
    draggableTracks: { type: Boolean, default: true },
    autoUpdate: { type: Boolean, default: true },
    classPrefix: { type: String, default: 'optiscroll-' },
    rtl: { type: Boolean, default: false },
    step: { type: Number, default: 40 },
    size: { type: Function },
    tag: { type: String, default: 'div' },
    vBlank: Number,
    hBlank: Number
  },
  data () {
    this.cache = {}
    this.TimerName = [
      AutoIncrementID('ScrollCheckLoop'),
      AutoIncrementID('ScrollTimerStop'),
      AutoIncrementID('OptiscrollWheelEvent')
    ]
    return {
      classes: [this.classPrefix.replace('-', ''), 'is-enabled']
    }
  },
  computed: {
    vBar () { return this.$refs.vBar },
    hBar () { return this.$refs.hBar }
  },
  render ($$) {
    let {
      $slots, classPrefix, cache, classes, realTimeRendering,
      scroll, preventParentScroll, forceScrollbars, rtl, tag,
      vBlank, hBlank
    } = this
    let $root = { class: classes }
    let $content = { class: [classPrefix + 'content', 'real-time'] }
    let size = scrollbarSpec.width
  
    if (size || forceScrollbars) {
      if (size === 0) {
        $content.class.push('data-scroll')
      } else {
        $content.style = {
          [rtl ? 'left' : 'right']: -size + 'px',
          bottom: -size + 'px'
        }
        $content.on = {
          scroll: throttle(scroll.bind(this), scrollMinUpdateInterval),
          mousewheel: this.wheel
        }
        if (isTouch) {
          $content.on.touchstart = this.touchStart
          $content.on.touchend = this.touchEnd
        }
      }
    }

    if (isTouch && preventParentScroll) {
      $root.class.push(classPrefix + 'prevent')
    }
    
    let children = [$$(tag, $content, [$slots.default])]
    
    children.push($$(Bar, { ref: 'hBar',
      props: { cache, which: 'h', blank: hBlank },
      on: {
        draw: (size) => {
          this.scrollEl.scrollLeft = size
          if (this.hasHeader) {
            this.$el.lastElementChild.firstElementChild.scrollLeft = size
          }
        }
      }
    }))
    children.push($$(Bar, { ref: 'vBar',
      props: { cache, which: 'v', blank: vBlank },
      on: {
        draw: (size) => {
          if (!realTimeRendering) {
            this.scrollEl.scrollTop = size
          }
          this.fireCustomEvent('scroll')
        }
      }
    }))
  
    if ($slots.header) {
      this.hasHeader = !!children.push($slots.header)
    }
    
    return $$('div', $root, children)
  },
  mounted () {
    let { autoUpdate, $el, TimerName } = this
    let index = instances.indexOf(this)
    this.scrollEl = $el.firstElementChild
    if (autoUpdate) {
      if (index < 0) {
        instances.push(this)
      }
      checkTimer = checkTimer || Timer(TimerName[0], checkLoop.bind(this), checkFrequency, !0, !0)
    } else {
      this.update()
    }
    if ((this.rtl = window.getComputedStyle($el).direction === 'rtl')) {
      this.classes.push('is-rtl')
    }
  },
  methods: {
    content () {
      let {
        scrollEl: {
          scrollHeight: sH,
          clientHeight: cH,
          scrollWidth: sW,
          clientWidth: cW
        }
      } = this
      return {
        sH, cH, sW, cW
      }
    },
    update (height) {
      let {
        scrollEl: {
          scrollHeight: sH, scrollWidth: sW,
          clientHeight: cH, clientWidth: cW
        },
        cache: {
          scrollW, scrollH, clientW, clientH
        },
        realTimeRendering, size, cache
      } = this
      
      size = fire(size)
      
      // 调整 1px 误差
      if (~~(sW - cW) === 1) {
        sW = cW
      }
      
      if (size) {
        sH = size.sH || sH
        sW = size.sW || sW
        cH = size.cH || cH
        cW = size.cW || cW
      }
      sH = height || sH
      
      if (sH !== scrollH || cH !== clientH ||
          sW !== scrollW || cW !== clientW) {
        cache.scrollH = sH
        cache.clientH = cH
        cache.scrollW = sW
        cache.clientW = cW

        // only fire if cache was defined
        if (isDefined(clientH)) {
          this.fireCustomEvent('sizechange')
        }

        if (sH !== scrollH && realTimeRendering) {
          let position = this.vBar.position
          if (sH < position() + cH) {
            position(sH, () => {
              this.fireCustomEvent('scroll')
            })
          }
        }
        // this will update the scrollbar
        // and check if bottom is reached
        invoke(this.$refs, 'update')
      }
    },
    scroll (ev) {
      let {
        cache, vBar, hBar, scrollStop, fireCustomEvent,
        realTimeRendering, scrollStopDelay, TimerName
      } = this
      let { scrollTop, scrollLeft } = ev.target
      
      if (!pauseCheck) {
        fireCustomEvent('scrollstart')
      }
      pauseCheck = true
      
      if (!realTimeRendering) {
        vBar.update(scrollTop)
      }
      hBar.update(scrollLeft)

      fireCustomEvent('scroll')
      
      cache.timerStop = Timer(TimerName[1], scrollStop, scrollStopDelay, !0)
    },
    touchStart (ev) {
      pauseCheck = false
      this.wheel(ev)
    },
    touchEnd () {
      this.cache.timerStop.stop()
    },
    scrollStop () {
      this.fireCustomEvent('scrollstop')
      pauseCheck = false
    },
    wheel (ev) {
      let {
        scrollEl, realTimeRendering, preventParentScroll, scrollAnimation, step, vBar, TimerName,
        cache: { v: cacheV, h: cacheH, scrollH, scrollW, clientH, clientW }
      } = this
      let preventScroll = preventParentScroll && isTouch
      
      window.cancelAnimationFrame(scrollAnimation)
      if (preventScroll) {
        if (cacheV.enabled && cacheV.percent % 100 === 0) {
          scrollEl.scrollTop = cacheV.percent ? (scrollH - clientH - 1) : 1
        }
        if (cacheH.enabled && cacheH.percent % 100 === 0) {
          scrollEl.scrollLeft = cacheH.percent ? (scrollW - clientW - 1) : 1
        }
      } else {
        if (realTimeRendering) {
          ev.preventDefault()
          Timer(TimerName[2], () => {
            let { wheelDelta } = ev
            let { position, update } = vBar
            position(position() - (wheelDelta > 0 ? step : -step), () => {
              update() || this.fireCustomEvent('scroll')
            })
          }, 10)
        }
      }
    },
    fireCustomEvent (name) {
      let {
        realTimeRendering,
        vBar: { position },
        cache: { v, h, clientH, clientW, scrollH: sH, scrollW: sW }
      } = this
      this.$emit(name, {
        // scrollbars data
        scrollbarV: extend({}, v),
        scrollbarH: extend({}, h),
  
        // scroll position
        scrollTop: realTimeRendering ? position() : (v.position || 0) * sH,
        scrollLeft: (h.position || 0) * sW,
        scrollBottom: (1 - v.position - v.size) * sH,
        scrollRight: (1 - h.position - h.size) * sW,
  
        // element size
        scrollWidth: sW,
        scrollHeight: sH,
        clientWidth: clientW,
        clientHeight: clientH
      })
    },
    scrollTo (destX, destY, duration) {
      let { vBar, hBar, cache } = this
      let startX, startY, endX, endY
    
      pauseCheck = true
      // force update
      this.update()
    
      startX = this.scrollEl.scrollLeft
      startY = this.vBar.position()
    
      endX = +destX
      if (destX === 'left') { endX = 0 }
      if (destX === 'right') { endX = cache.scrollW - cache.clientW }
      if (destX === false) { endX = startX }
    
      endY = +destY
      if (destY === 'top') { endY = 0 }
      if (destY === 'bottom') { endY = cache.scrollH - cache.clientH }
      if (destY === false) { endY = startY }

      this.animateScroll(startX, endX, startY, endY, +duration)
      
      return {
        X: hBar.position(endX),
        Y: vBar.position(endY)
      }
    },
    scrollIntoView (elem, duration, delta) {
      let scrollEl = this.scrollEl
      let eDim, sDim
      let leftEdge, topEdge, rightEdge, bottomEdge
      let offsetX, offsetY
      let startX, startY, endX, endY
    
      pauseCheck = true
      // force update
      this.update()
    
      if (typeof elem === 'string') { // selector
        elem = scrollEl.querySelector(elem)
      } else if (elem.length && elem.jquery) { // jquery element
        elem = elem[0]
      }
    
      if (typeof delta === 'number') { // same delta for all
        delta = { top: delta, right: delta, bottom: delta, left: delta }
      }
    
      delta = delta || {}
      eDim = elem.getBoundingClientRect()
      sDim = scrollEl.getBoundingClientRect()
    
      startX = endX = scrollEl.scrollLeft
      startY = endY = scrollEl.scrollTop
      offsetX = startX + eDim.left - sDim.left
      offsetY = startY + eDim.top - sDim.top
    
      leftEdge = offsetX - (delta.left || 0)
      topEdge = offsetY - (delta.top || 0)
      rightEdge = offsetX + eDim.width - this.cache.clientW + (delta.right || 0)
      bottomEdge = offsetY + eDim.height - this.cache.clientH + (delta.bottom || 0)
    
      if (leftEdge < startX) { endX = leftEdge }
      if (rightEdge > startX) { endX = rightEdge }
    
      if (topEdge < startY) { endY = topEdge }
      if (bottomEdge > startY) { endY = bottomEdge }

      this.animateScroll(startX, endX, startY, endY, +duration)
    },
    animateScroll (startX, endX, startY, endY, duration) {
      let self = this
      let { vBar, hBar, realTimeRendering, fireCustomEvent } = self
      let startTime = Date.now()
      let easingFunction = function (t) {
        return (--t) * t * t + 1
      }
      let update = function (bar, size) {
        bar.position(size, (v0, v1) => {
          if (v0 !== v1) {
            bar.update()
            bar.$emit('draw', v0)
          }
        })
      }

      if (endX === startX && endY === startY) {
        return
      }
    
      if (duration === 0) {
        vBar.update(endY)
        hBar.update(endX)
        if (realTimeRendering) {
          fireCustomEvent('scroll')
        }
        return
      }
    
      if (isNaN(duration)) { // undefined or auto
        // 500px in 430ms, 1000px in 625ms, 2000px in 910ms
        duration = Math.pow(Math.max(Math.abs(endX - startX), Math.abs(endY - startY)), 0.54) * 15
      }
    
      (function animate () {
        let time = Math.min(1, ((Date.now() - startTime) / duration))
        let easedTime = easingFunction(time)
      
        if (endY !== startY) {
          update(vBar, ~~(easedTime * (endY - startY)) + startY)
        }
        if (endX !== startX) {
          update(hBar, ~~(easedTime * (endX - startX)) + startX)
        }

        self.scrollAnimation = time < 1 ? window.requestAnimationFrame(animate) : null
      }())
    },
    toggleClass (value, bool) {
      let classes = this.classes
      let index = classes.indexOf(value)
      if (index >= 0) {
        if (!bool) {
          classes.splice(index, 1)
        }
      } else {
        if (bool) {
          classes.push(value)
        }
      }
    }
  },
  destroyed () {
    Timer.destroy(this.TimerName)
    window.requestAnimationFrame(() => {
      let index = instances.indexOf(this)
      if (index > -1) {
        instances.splice(index, 1)
      }
    })
  }
}
