export default{
  name: 'FactoryRender',
  functional: false,
  render: function ($$) {
    return this.init($$, this)
  },
  props: {
    init: Function
  },
  install (Vue) {
    Vue.component(this.name, this)
  }
}
