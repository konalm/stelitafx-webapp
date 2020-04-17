import Vue from 'vue';
import Router from 'vue-router';

const Prototypes = () => import('@/components/Prototypes');
const PrototypeAnalysis = () => import('@/components/PrototypeAnalysis');
import Home from '@/components/Home.vue';
import Currency from '@/components/Currency.vue';
import PrototypeCurrencyAnalysis from '@/components/PrototypeCurrencyAnalysis';
import Monitor from '@/components/Monitor'
import TradeAnalysis from '@/components/TradeAnalysis';
import Charting from '@/components/Charting';
import RateChart from '@/components/RateChart';
import Report from '@/components/Report';
import Simulator from '@/views/Simulator';
import CandlePatterns from '@/views/CandlePatterns';
const Strategies = () => import('@/views/Strategies');
const Strategy = () => import('@/views/Strategy');
const MasterAlgo = () => import('@/views/MasterAlgo');


Vue.use(Router);


export default new Router({
  routes: [
    {
      path: '/strategies',
      name: 'Strategies',
      component: Strategies
    },
    {
      path: '/strategies/:UUID',
      name: 'Strategy',
      component: Strategy
    },
    {
      path: '/strategies/:strategyUUID/master-algo/:masterAlgoUUID',
      name: 'MasterAlgo',
      component: MasterAlgo
    },
    {
      path: '/',
      name: 'Currencies',
      component: Home
    },
    {
      path: '/currencies/:abbrev',
      name: 'Currency',
      component: Currency
    },
    {
      path: '/prototypes',
      name: 'Home',
      redirect: '/prototypes/intervals/1'
    },
    {
      path: '/prototypes/intervals/:interval',
      name: 'Prototypes',
      component: Prototypes,
    },
    {
      path: '/prototypes/:no/intervals/:interval',
      name: 'PrototypeAnalysis',
      component: PrototypeAnalysis
    },
    {
      path: '/protos/:protoNo/intervals/:interval/currencies/:currency/trade-analysis/:UUID',
      name: 'TradeAnalysis',
      component: TradeAnalysis
    },
    {
      path: '/prototypes/:no/currencies/:currency/intervals/:interval',
      name: 'PrototypeCurrencyAnalysis',
      component: PrototypeCurrencyAnalysis
    },
    {
      path: '/monitor',
      name: 'Monitor',
      component: Monitor
    },
    {
      path: '/charting',
      name: 'Charting',
      component: Charting
    },
    {
      path: '/rate-chart',
      name: 'RatesChart',
      component: RateChart
    },
    {
      path: '/report',
      name: 'Report',
      component: Report
    },
    {
      path: '/simulator',
      name: 'Simulator',
      component: Simulator
    },
    {
      path: '/candle-patterns',
      name: 'CandlePatterns',
      component: CandlePatterns
    },
  ],

  mode: 'history',
});
