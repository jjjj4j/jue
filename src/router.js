import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '',
      redirect: () => '/user'
    },
    {
      path: '/user',
      name: 'user',
      component: () => import(/* webpackChunkName: "about" */ './views/user')
    },
    {
      path: '/group',
      name: 'group',
      component: () => import(/* webpackChunkName: "about" */ './views/group')
    },
    {
      path: '/device',
      name: 'device',
      component: () => import(/* webpackChunkName: "about" */ './views/device')
    },
    {
      path: '/camera',
      name: 'camera',
      component: () => import(/* webpackChunkName: "about" */ './views/camera')
    }
  ]
})
