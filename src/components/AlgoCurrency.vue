<template>
  <app-template>
    <p class="lead">Currency: {{ baseCurrency }}</p>
    <p class="lead">Quote Currency: {{ quoteCurrency }}</p>
    <p class="lead">Prototype: {{ algoId }}</p>

    <b-list-group class="mt-5">
      <b-list-group-item v-for="trade in trades">
        trade here ???
      </b-list-group-item>
    </b-list-group>

    <b-alert show variant="warning">
      No trades!
    </b-alert>
  </app-template>
</template>


<script>
import AppTemplate from '@/components/patterns/AppTemplate';
import { getCurrencyTradesHttpRequest } from '@/http/trade';

export default {
  components: {
    AppTemplate
  },

  data() {
    return {
      prototypeNo: 0,
      baseCurrency: '',
      quoteCurrency: 'USD',
      algoId: 0,
      trades: [],
      tradesUploaded: false,
    }
  },

  beforeMount() {
    this.algoId = this.$route.params.algoNo;
    this.baseCurrency = this.$route.params.currency;
    this.uploadCurrencyTrades();
  },

  methods: {
    uploadCurrencyTrades() {
      getCurrencyTradesHttpRequest(this.algoId, this.baseCurrency)
        .then(res => {
          this.trades = res;
        })
        .finally(() => {
          this.tradesUploaded = true;
        })
    }
  }
}
</script>
