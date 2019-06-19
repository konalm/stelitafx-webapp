<template>
  <b-col>
    <b-card v-bind:title="currencyRate.abbrev">
      <b-card-text> Date: {{ currencyRate.date }} </b-card-text>
      <b-card-text> Rate: {{ currencyRate.exchange_rate }} </b-card-text>
      <b-card-text> 12 WMA: {{ WMAs['12']}} </b-card-text>
      <b-card-text> 26 WMA: {{ WMAs['26'] }} </b-card-text>
      <b-button> Open in Trading View </b-button>
    </b-card>
  </b-col>
</template>


<script>
import { currencyWMAHttpGetRequest } from '@/http/currencyRates';

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
      WMAs: {
        '12': 0,
        '26': 0
      }
    }
  },

  beforeMount() {
    this.uploadWMA(12);
    this.uploadWMA(26);
  },

  methods: {
    /**
     * get weight moving average for specified weight moving average length then
     * set to state
     */
    async uploadWMA(WMALength) {
      let response;
      try {
        response = await currencyWMAHttpGetRequest(this.currencyRate.base_currency, WMALength);
      } catch (err) {
        throw new Error(err);
      }

      this.WMAs[WMALength.toString()] = response.weightedMovingAverage;
    }
  }
}
</script>
