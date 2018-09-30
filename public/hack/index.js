(function () {
  var $el = null
  function $$ (name, attr, value) {
    $el = document.createElement(name)
    $el.setAttribute(attr, value)
    document.write($el.outerHTML)
  }
  
  if (!window.requestAnimationFrame) {
    $$('script', 'src', '/hack/requestAnimationFrame.js')
  }
})()
