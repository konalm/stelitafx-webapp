<template>
  <b-col class="text-center">
    <b-card v-bind:title="currencyRate.abbrev">
      <div class="row mt-4">
        <div class="col">
          <router-link :to="{
            name: 'Currency',
            params: { abbrev: currencyRate.base_currency }
          }">
            <b-button variant="primary" class="px-4">View</b-button>
          </router-link>
        </div>
      </div>
    </b-card>
  </b-col>
</template>


<script>
import { currencyWMAHttpGetRequest } from '@/http/currencyRates';

const SHORT_WMA_LENGTH = 12;
const LONG_WMA_LENGTH = 26;


export default {
  props: {
    currencyRate: {
      base_currency: '',
      date: '',
      rate: '',
      twelveWMA: '',
      twentySixWMA: ''
    },
  },

  data() {
    return {
      shortWMA: 0,
      prevShortWMA: 0,
      longWMA: 0,
      prevLongWMA: 0,
    }
  },

  computed: {
    WMATrend() {
      return this.getWMATrend(this.shortWMA, this.longWMA);
    },

    prevWMATrend() {
      return this.getWMATrend(this.prevShortWMA, this.prevLongWMA);
    }
  },

  beforeMount() {
  
  },

  methods: {
    getWMATrend(shortWMA, longWMA) {
      if (shortWMA > longWMA) return 'up';
      if (shortWMA === longWMA) return 'neutral';
      if (shortWMA < longWMA) return 'down';
    },

    /**
     * get weight moving average for specified weight moving average length then
     * set to state
     */
    async uploadWMA(WMALength) {
      return await currencyWMAHttpGetRequest(
                     this.currencyRate.base_currency,
                     WMALength,
                     2
                   );
    }
  }
}
</script>
