import Vue from 'vue'
import App from './App.vue'
import Vuetify from "vuetify"
import "vuetify/dist/vuetify.min.css"
import vuetify from './plugins/vuetify'
import '@mdi/font/css/materialdesignicons.css'
import axios from 'axios'


Vue.prototype.$http = axios
Vue.config.productionTip = false
Vue.use(Vuetify)
window.axios = require("axios");

new Vue({
  vuetify,
  icons: {
    iconfont: 'mdi', // default - only for display purposes
  },
  render: h => h(App)
}).$mount('#app')
