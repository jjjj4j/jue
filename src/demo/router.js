import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/ajax',
      component: function (resolve) {
        require(['@/demo/page/ajax'], resolve)
      }
    },
    {
      path: '/tree',
      component: function (resolve) {
        require(['@/demo/page/tree'], resolve)
      }
    }
  ]
})
