import Vue from 'vue';
import Router from 'vue-router';

import Home from '@/components/Home.vue';
import Currency from '@/components/Currency.vue';
import Protos from '@/components/Protos';
import AlgoCurrency from '@/components/AlgoCurrency';
import AlgoCurrencyTrade from '@/components/AlgoCurrencyTrade.vue';
import Proto from '@/components/Proto';
Vue.use(Router);


export default new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/currencies/:abbrev',
      name: 'Currency',
      component: Currency
    },
    {
      path: '/protos',
      name: 'Protos',
      component: Protos
    },
    {
      path: '/algo/:algoNo/currency/:currency',
      name: 'AlgoCurrency',
      component: AlgoCurrency
    },
    {
      path: '/algo/:algoNo/currency/:currency/trade/:tradeId',
      name: 'AlgoCurrencyTrade',
      component: AlgoCurrencyTrade
    },
    {
      path: '/proto/:id',
      name: 'Proto',
      component: Proto
    }
  ],

  mode: 'history',
});
