<template>
  <app-template>
    <b-row class="mt-5">
      <currency-rate v-for="currencyRate in currencyPairsLatestRates"
        :key="currencyRate.UUID"
        :currencyRate="currencyRate"
      />
    </b-row>
  </app-template>
</template>


<script>
import AppTemplate from '@/components/patterns/AppTemplate';
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
    AppTemplate,
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
