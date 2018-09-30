import Vue from 'vue'
import router from './router'
import App from './App.vue'
import '@/static/comp'
import '@/static/el-comp'
import '@/service/controller'

import 'element-ui/lib/theme-chalk/index.css'

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
