import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/ajax',
      component: () => import('@/demo/views/ajax')
    },
    {
      path: '/tree',
      component: () => import('@/demo/views/tree')
    },
    {
      path: '/browser',
      component: () => import('@/demo/views/browser')
    },
    {
      path: '/md5',
      component: () => import('@/demo/views/md5')
    },
    {
      path: '/factory-render',
      component: () => import('@/demo/views/factoryRender')
    },
    {
      path: '/form',
      component: () => import('@/demo/views/form')
    },
    {
      path: '/keyboard',
      component: () => import('@/demo/views/keyboard')
    },
    {
      path: '/scrollbar',
      component: () => import('@/demo/views/scrollbar')
    },
    {
      path: '/date-time',
      component: () => import('@/demo/views/dateTime')
    },
    {
      path: '/jtree',
      component: () => import('@/demo/views/tree/jtree')
    },
    {
      path: '/jtree-0',
      component: () => import('@/demo/views/tree/jtree-0')
    },
    {
      path: '/jtree-1',
      component: () => import('@/demo/views/tree/jtree-1')
    },
    {
      path: '/jtree-2',
      component: () => import('@/demo/views/tree/jtree-2')
    },
    {
      path: '/jtree-3',
      component: () => import('@/demo/views/tree/jtree-3')
    },
    {
      path: '/jtable',
      component: () => import('@/demo/views/table/jtable')
    },
    {
      path: '/jtable-0',
      component: () => import('@/demo/views/table/jtable-0')
    },
    {
      path: '/jtable-1',
      component: () => import('@/demo/views/table/jtable-1')
    },
    {
      path: '/jtable-2',
      component: () => import('@/demo/views/table/jtable-2')
    },
    {
      path: '/upload',
      component: () => import('@/demo/views/upload')
    },
    {
      path: '/dialog',
      component: () => import('@/demo/views/dialog')
    },
    {
      path: '/edit-table',
      component: () => import('@/demo/views/editTable')
    },
    {
      path: '/web-sql',
      component: () => import('@/demo/views/webSql')
    }
  ]
})
