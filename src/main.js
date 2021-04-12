import Vue from 'vue'
import App from './App.vue'
import http from '@/utils/http'
Vue.prototype.$http = http // ajax请求方法

import "../../../assets/common/reset.css"
import 'amfe-flexible';
Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
