import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import '@/static/comp'
import '@/static/el-comp'
import '@/service/controller-prod'

import 'element-ui/lib/theme-chalk/index.css'

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
