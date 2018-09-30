import Scrollbar from './optiscroll.js'

Scrollbar.name = 'Scrollbar'
Scrollbar.install = function (Vue) {
  Vue.component(Scrollbar.name, Scrollbar)
}

export default Scrollbar
