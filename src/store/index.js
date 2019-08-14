import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

import dateFilterModule from './dateFilter';
import tradeModule from './trade';

export default new Vuex.Store({
  strict: true,
  modules: {
    dateFilter: dateFilterModule,
    trade: tradeModule
  }
})
