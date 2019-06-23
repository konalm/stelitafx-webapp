import Vue from 'vue';
import Router from 'vue-router';

import Home from '@/components/Home.vue';
import Currency from '@/components/Currency.vue';
import Algos from '@/components/Algos.vue';
import AlgoCurrency from '@/components/AlgoCurrency.vue';

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
      path: '/algo/:algoNo/currency/:currency',
      name: 'AlgoCurrency',
      component: AlgoCurrency
    },
    {
      path: '/algos',
      name: 'Algos',
      component: Algos
    }
  ],

  mode: 'history',
});
