import { extend, isDefined } from '@/util/core'
import { cssTransform, scrollbarSpec } from './globals'
import { each } from '@/util/array'

let evTypesMatcher = /^(mouse|touch|pointer)/
let evTypes = window.PointerEvent ? ['pointerdown'] : ['touchstart', 'mousedown']
let rtlMode = scrollbarSpec.rtl

export default {
  props: {
    which: {
      type: String,
      default: 'v'
    }
  },
  data () {
    this.instance = this.$parent
    this.rtl = this.instance.rtl
    this.cache = this.instance.cache
    this.minTrackSize = this.instance.minTrackSize
    this.maxTrackSize = this.instance.maxTrackSize
    this.classPrefix = this.instance.classPrefix
    this.isVertical = this.which === 'v'
    this.scrollProp = `scroll${this.isVertical ? 'Top' : 'Left'}`
    this.scrollbarCache = this.cache[this.which] = { [this.scrollProp]: 0 }
    return {
      style: {
        marginRight: 0,
        [cssTransform]: '',
        [this.isVertical ? 'height' : 'width']: 0
      }
    }
  },
  computed: {
    evSuffixes () {
      return this.isVertical ? ['top', 'bottom'] : ['left', 'right']
    },
    clientSize () {
      return `client${this.isVertical ? 'H' : 'W'}`
    },
    scrollSize () {
      return `scroll${this.isVertical ? 'H' : 'W'}`
    }
  },
  render ($$) {
    let { which, classPrefix, style } = this
    let $div = {
      class: classPrefix + which
    }
    let $p = {
      style,
      on: {},
      class: classPrefix + which + 'track'
    }
    
    each(evTypes, (evType) => {
      $p.on[evType] = this.dragStart
    })
    this.trackEl = $$('b', $p)
    
    return $$('div', $div, [this.trackEl])
  },
  methods: {
    position (value, callback) {
      let { cache, scrollSize, clientSize, scrollbarCache, scrollProp } = this
      let position = scrollbarCache[scrollProp]
      if (isDefined(value)) {
        let max = cache[scrollSize] - cache[clientSize], min = 0
        if (value !== position) {
          if (value < min) value = min
          if (value > max) value = max
          scrollbarCache[scrollProp] = value
        }
        if (callback) {
          callback(value, position)
        } else {
          return value
        }
      } else {
        return position || 0
      }
    },
    update (size) {
      let {
        enabled, cache, clientSize, scrollSize, scrollbarCache, trackEl, position
      } = this
      let flag = true
      let newSize, oldSize, newRelPos, deltaPos, newDim
      
      if (!enabled && cache[clientSize] === cache[scrollSize]) { return }
      
      if (isDefined(size)) { position(size) }
      
      newDim = this.calc()
      each(newDim, (value, key) => {
        if (this[key] !== value) {
          return (flag = false)
        }
      })
      if (flag) { return }

      newSize = newDim.size
      oldSize = scrollbarCache.size
      newRelPos = (1 / newSize) * newDim.position * 100
      deltaPos = Math.abs(newDim.position - (scrollbarCache.position || 0)) * cache[clientSize]
      
      if (newSize === 1 && enabled) {
        this.toggle(false)
      }
      
      if (newSize < 1 && !enabled) {
        this.toggle(true)
      }
      
      enabled = this.enabled
      if (trackEl && enabled) {
        this.styleEvent(newRelPos, deltaPos, newSize, oldSize)
      }
      
      extend(scrollbarCache, newDim)
      
      if (enabled) {
        this.fireEdgeEv()
      }
    },
    styleEvent (newRelPos, deltaPos, newSize, oldSize) {
      let { style, rtl, isVertical } = this
      if (newSize !== oldSize) {
        style[isVertical ? 'height' : 'width'] = newSize * 100 + '%'
        if (rtl && !isVertical) {
          style.marginRight = (1 - newSize) * 100 + '%'
        }
      }
      style[cssTransform] = `translate(${isVertical ? '0%,' + newRelPos + '%' : newRelPos + '%' + ',0%'})`
    },
    calc () {
      let {
        cache, position: getPosition, clientSize, scrollSize, isVertical,
        rtl, minTrackSize, maxTrackSize
      } = this
      let position = getPosition()
      let viewS = cache[clientSize]
      let scrollS = cache[scrollSize]
      let sizeRatio = viewS / scrollS
      let sizeDiff = scrollS - viewS
      let positionRatio, percent
      
      if (sizeRatio >= 1 || !scrollS) {
        return { position: 0, size: 1, percent: 0 }
      }
      if (!isVertical && rtl && rtlMode) {
        position = sizeDiff - position * rtlMode
      }
      
      percent = 100 * position / sizeDiff
      
      if (position <= 1) {
        percent = 0
      }
      if (position >= sizeDiff - 1) {
        percent = 100
      }
      
      sizeRatio = Math.max(sizeRatio, minTrackSize / 100)
      sizeRatio = Math.min(sizeRatio, maxTrackSize / 100)
      
      positionRatio = (1 - sizeRatio) * (percent / 100)
      
      return { position: positionRatio, size: sizeRatio, percent }
    },
    fireEdgeEv () {
      let { instance, scrollbarCache: { was, percent }, evSuffixes } = this
      
      if (was !== percent && percent % 100 === 0) {
        instance.fireCustomEvent('scrollreachedge')
        instance.fireCustomEvent('scrollreach' + evSuffixes[percent / 100])
      }
      
      this.scrollbarCache.was = percent
    },
    toggle: function (bool) {
      let { instance, trackEl, which, scrollbarCache } = this
      this.enabled = bool
      
      if (trackEl) {
        instance.toggleClass('has-' + which + 'track', bool)
      }
      
      scrollbarCache.enabled = bool
    },
    dragEnd () {
      this.bind(false, this.evType)
    },
    dragStart (ev) {
      ev.preventDefault()
      this.evType = ev.type.match(evTypesMatcher)[1]
      let { scrollbarCache, position, evType } = this
      let { pageX, pageY } = ev.touches ? ev.touches[0] : ev
     
      extend(scrollbarCache, {
        x: pageX,
        y: pageY
      })

      this.scroll = position()
      this.bind(true, evType)
    },
    dragMove (ev) {
      ev.preventDefault()
      let {
        cache, clientSize, scrollSize,
        isVertical, rtl, scroll, position,
        scrollbarCache: { x, y }
      } = this
      let { pageY, pageX } = ev.touches ? ev.touches[0] : ev
      let dragMode = rtl && rtlMode === 1 && !isVertical ? -1 : 1
      let delta, deltaRatio
    
      delta = isVertical ? pageY - y : pageX - x
      deltaRatio = delta / cache[clientSize]
      
      position(scroll + deltaRatio * cache[scrollSize] * dragMode, (v0, v1) => {
        if (v0 !== v1) {
          this.update()
          this.$emit('draw', v0)
        }
      })
    },
    bind (on, type) {
      let method = (on ? 'add' : 'remove') + 'EventListener'
      let moveEv = type + 'move'
      let upEv = type + (type === 'touch' ? 'end' : 'up')
      
      document[method](moveEv, this.dragMove)
      document[method](upEv, this.dragEnd)
      document[method](type + 'cancel', this.dragEnd)
    }
  },
  destroyed () {
    this.bind(!1, this.evType)
  }
}
