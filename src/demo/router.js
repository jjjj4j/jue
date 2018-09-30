import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/ajax',
      component: () => import('@/demo/page/ajax')
    },
    {
      path: '/tree',
      component: () => import('@/demo/page/tree')
    },
    {
      path: '/browser',
      component: () => import('@/demo/page/browser')
    },
    {
      path: '/md5',
      component: () => import('@/demo/page/md5')
    },
    {
      path: '/factory-render',
      component: () => import('@/demo/page/factoryRender')
    },
    {
      path: '/form',
      component: () => import('@/demo/page/form')
    },
    {
      path: '/keyboard',
      component: () => import('@/demo/page/keyboard')
    },
    {
      path: '/scrollbar',
      component: () => import('@/demo/page/scrollbar')
    }
  ]
})
