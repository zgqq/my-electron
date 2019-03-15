import Vue from 'vue'
import axios from 'axios'

import App from './App'
import router from './router'
import store from './store'

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.http = Vue.prototype.$http = axios
Vue.config.productionTip = false

// var e = require('electron')
// e.globalShortcut.register('cmd+option+l', function () {
//   console.log('nice')
// })
/* eslint-disable no-new */
store.dispatch('nice')
new Vue({
  components: { App },
  router,
  store,
  template: '<App/>'
}).$mount('#app')
