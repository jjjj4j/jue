// Get scrollbars width, thanks Google Closure Library
function getScrollbarSpec () {
  let htmlEl = document.documentElement
  let outerEl, innerEl, width = 0, rtl = 1 // IE is reverse

  outerEl = document.createElement('div')
  outerEl.style.cssText = 'overflow:scroll;width:50px;height:50px;position:absolute;left:-100px;direction:rtl'

  innerEl = document.createElement('div')
  innerEl.style.cssText = 'width:100px;height:100px'

  outerEl.appendChild(innerEl)
  htmlEl.appendChild(outerEl)
  width = outerEl.offsetWidth - outerEl.clientWidth
  if (outerEl.scrollLeft > 0) {
    rtl = 0 // webkit is default
  } else {
    outerEl.scrollLeft = 1
    if (outerEl.scrollLeft === 0) {
      rtl = -1 // firefox is negative
    }
  }
  htmlEl.removeChild(outerEl)

  return { width: width, rtl: rtl }
}

function getPassiveSupport () {
  let passive = false
  let options = Object.defineProperty({}, 'passive', {
    get: function () { passive = true }
  })
  window.addEventListener('test', null, options)
  return passive ? { capture: false, passive: true } : false
}

// Detect css3 support, thanks Modernizr
function cssTest (prop) {
  let ucProp = prop.charAt(0).toUpperCase() + prop.slice(1)
  let el = document.createElement('test')
  let props = [prop, 'Webkit' + ucProp]

  for (var i in props) {
    if (el.style[props[i]] !== undefined) { return props[i] }
  }
  return props[0] || ''
}

export function throttle (fn, threshhold) {
  let last, deferTimer
  return function () {
    let context = this
    let now = Date.now()
    let args = arguments
    if (last && now < last + threshhold) {
      // hold on to it
      clearTimeout(deferTimer)
      deferTimer = setTimeout(function () {
        last = now
        fn.apply(context, args)
      }, threshhold)
    } else {
      last = now
      fn.apply(context, args)
    }
  }
}

const isTouch = 'ontouchstart' in window
const cssTransform = cssTest('transform')
const scrollbarSpec = getScrollbarSpec()
const passiveEvent = getPassiveSupport()

const instances = []

export {
  isTouch, cssTransform, scrollbarSpec, passiveEvent, instances
}
