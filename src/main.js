import Vue from 'vue'
// import Vuex from 'vuex'
import { Modal, Datepicker, Timepicker, Field } from 'buefy/dist/components';
import 'buefy/dist/buefy.css'
import App from './App.vue';
import BootstrapVue from 'bootstrap-vue'
import router from './router';
import store from './store';

Vue.config.productionTip = false
Vue.use(BootstrapVue)

Vue.use(Modal)
Vue.use(Datepicker)
Vue.use(Timepicker)
Vue.use(Field)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>',
  render: h => h(App)
})
