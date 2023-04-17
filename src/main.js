import Vue from 'vue'
import App from './App.vue'
import router from './router'
import VueSession from 'vue-session'

console.log('ta mère');

import axios from 'axios'

Vue.use(VueSession, {
    persist: true
});

const eventBus = new Vue();

Object.defineProperties(Vue.prototype, {
    $axios: {
        get: () => axios
    },
    $eventbus: {
        get: () => eventBus
    },
    $url: {
        get: () => window.appConfig.urlApi
    },
    $downurl: {
        get: () => window.appConfig.urlDown
    },
    $vlchotfix: {
        get: () => window.appConfig.vlcHotFix
    },
});


Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
