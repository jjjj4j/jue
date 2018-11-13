/**
 * Created by ZJ on 2015/9/25.
 */
(function (_) {
  var browser = (function () {
      var uaMatch = function (ua) {
        ua = ua.toLowerCase()
        
        var match = /(chrome)[ \\/]([\w.]+)/.exec(ua) ||
              /(webkit)[ \\/]([\w.]+)/.exec(ua) ||
              /(opera)(?:.*version|)[ \\/]([\w.]+)/.exec(ua) ||
              /(msie) ([\w.]+)/.exec(ua) ||
              ua.indexOf('compatible') < 0 && /(mozilla)(?:.*? rv:([\w.]+)|)/.exec(ua) || []
          
        return {
          browser: match[1] || '',
          version: match[2] || '0'
        }
      }
      
      var matched = uaMatch(navigator.userAgent),
        browser = {}
        
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
      return browser
    })(),
    version = parseFloat(browser.version.slice(0, 2))
  
  if (browser.msie) {
    if (version < 9) {
      _.location.href = '/chrome.html'
    }
  }
})(this)
