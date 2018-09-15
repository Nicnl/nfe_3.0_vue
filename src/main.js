// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import VueSession from 'vue-session'

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
        get: () => 'http://vmshare.nicnl.com:9001'
    },
    $downurl: {
        get: () => 'http://vmshare.nicnl.com:9000'
    }
});


Vue.config.productionTip = false


/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
});
