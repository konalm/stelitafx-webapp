import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

import dateFilterModule from './dateFilter';
import tradeModule from './trade';
import timeIntervalModule from './timeInterval';
import currencyModule from './currency';
import prototypeModule from './prototype';
import currencyRateModule from './currencyRate';
import algorithmModule from './algorithm';

export default new Vuex.Store({
  strict: true,
  modules: {
    dateFilter: dateFilterModule,
    trade: tradeModule,
    timeInterval: timeIntervalModule,
    currency: currencyModule,
    prototype: prototypeModule,
    currencyRate: currencyRateModule,
    algorithm: algorithmModule
  }
})
