import Vue from 'vue'
import Buefy from 'buefy';
import 'buefy/dist/buefy.css'
import App from './App.vue';
import BootstrapVue from 'bootstrap-vue'
import router from './router';

Vue.config.productionTip = false
Vue.use(Buefy)
Vue.use(BootstrapVue)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>',
  render: h => h(App)
})
