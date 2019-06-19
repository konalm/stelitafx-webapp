<template>
  <div id="app">
    <div class="container mt-8">
      <h1>Stelita FX</h1>
      <h3 class="mt-4 mb-5">FX Trading Bot</h3>

      <b-row class="mt-4">
        <currency-rate v-for="currencyRate in currencyPairsLatestRates"
          :key="currencyRate.UUID"
          :currencyRate="currencyRate"
        />
      </b-row>
    </div>
  </div>
</template>

<script>
import {
  currencyPairLatestRateHttpGetRequest,
  currencyWMAHttpGetRequest
} from '@/http/currencyRates';
import CurrencyRate from '@/components/CurrencyRate.vue';


const currencyPreview = {
  date: '',
  rate: '',
  twelveWMA: '',
  twentySixWMA: ''
};

export default {
  name: 'app',

  components: {
    CurrencyRate
  },

  data() {
    return {
      currencyPairsLatestRates: [],
      AUDCurrency: currencyPreview,
      EURCurrency: currencyPreview,
      GBPCurrency: currencyPreview,
      JPYCurrency: currencyPreview,
    }
  },

  beforeMount() {
    this.getCurrencyRatesLatestRates();
  },

  methods: {
    getCurrencyRatesLatestRates() {
      currencyPairLatestRateHttpGetRequest()
        .then(response => {
          this.currencyPairsLatestRates = response;
        })
    },

    getCurrencyMVA(currency, wmaLength) {
      currencyWMAHttpGetRequest(currency, wmaLength);
    }
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 100px;
}
</style>
