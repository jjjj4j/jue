/* eslint-disable*/
let uaMatch = function (ua) {
  ua = ua.toLowerCase()
  
  let match = /(chrome)[ \\/]([\w.]+)/.exec(ua) ||
      /(webkit)[ \\/]([\w.]+)/.exec(ua) ||
      /(opera)(?:.*version|)[ \\/]([\w.]+)/.exec(ua) ||
      /(msie) ([\w.]+)/.exec(ua) ||
      ua.indexOf('compatible') < 0 && /(mozilla)(?:.*? rv:([\w.]+)|)/.exec(ua) ||
      []
  
  return {
    browser: match[1] || '',
    version: match[2] || '0'
  }
}

let matched = uaMatch(navigator.userAgent)
let is4plugin = !1
let browser = {}

if (matched.browser) {
  browser[matched.browser] = true
  browser.version = matched.version
}

// Chrome is Webkit, but Webkit is also Safari.
if (browser.chrome) {
  browser.webkit = true
} else if (browser.webkit) {
  browser.safari = true
}

let version = parseFloat(browser.version.slice(0, 2))
if (browser.chrome) {
  if (version <= 40 && version >= 30) {
    is4plugin = !0
  }
} else if (browser.msie) {
  is4plugin = !0
  if (version < 9) {
    browser.notChromeFrame = !0
  }
}

let isIE9 = !1
if (browser.msie && browser.version < 10) {
  isIE9 = !0
}
export {
  isIE9,
  is4plugin,
  browser
}
