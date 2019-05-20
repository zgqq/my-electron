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
const remote = require('electron').remote
const app = remote.app
const home = app.getPath('home')

let config
try {
  const fs = require('fs')
  let rawdata = fs.readFileSync(home + '/leo.json')
  config = JSON.parse(rawdata)
  console.log('config' + config)
} catch (e) {
  console.log('oh no big error', e)
  config = {}
}

if (typeof config.userData === 'undefined') {
  config.userData = app.getPath('userData')
}

Vue.mixin({
  data: function () {
    return {
      searchWindow: {
        height: 60,
        width: 650
      },
      appConfig: config
    }
  }
})

store.dispatch('nice')
new Vue({
  components: { App },
  router,
  store,
  template: '<App/>'
}).$mount('#app')
