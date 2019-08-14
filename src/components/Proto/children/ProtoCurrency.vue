<template>
  <b-col class="px-5">
    {{ currency }}
    <div class="bar-graph" v-bind:class="`${currency}-stats`"></div>

    <router-link :to="{name: 'AlgoCurrency', params: {
      algoNo: protoNo,
      currency
    }}">
      <b-button variant="primary" class="mt-2 w-100"> View </b-button>
    </router-link>
  </b-col>
</template>


<script>
import { getHttpRequest } from '@/http/apiRequestV2';
import { buildBarGraph, clearBarGraph } from '@/graph/barGraph';
import groupOrdersIntoTrades from '@/services/groupOrdersIntoTrades';
import pipCalculator from '@/services/pipCalculator';
import { mapGetters, mapActions } from 'vuex';

export default {
  props: {
    protoNo: 0,
    currency: '',
  },

  data() {
    return {
    }
  },

  computed: {
    ...mapGetters({
      filterDate: 'dateFilter/filterDate'
    }),

    trades() {
      return this.$store.getters['trade/protoCurrencyTrades'](
        this.protoNo,
        this.currency
      )
    },

    totalPips() {
      let gained = 0;
      let loss = 0;
      this.trades.forEach((trade) => {
        if (trade.pips > 0) gained += trade.pips
        if (trade.pips < 0) loss += trade.pips * -1
      });

      return {gained, loss};
    },

    graphData() {
      return [
        {
          label: 'Gain',
          value: this.totalPips.gained
        },
        {
          label: 'Loss',
          value: this.totalPips.loss
        }
      ];
    }
  },

  beforeMount() {
    this.uploadTrades({ protoNo: this.protoNo, baseCurrency: this.currency })
  },


  methods: {
    ...mapActions({
      uploadTrades: 'trade/uploadProtoCurrencyTrades'
    }),

    profitTrades() {
      return this.trades.filter((trade) => trade.pips > 0)
    },

    lossTrades() {
      return this.trades.filter((trade) => trade.pips < 0)
    }
  },

  watch: {
    graphData(value) {
      clearBarGraph(`${this.currency}-stats`);
      buildBarGraph(value, `${this.currency}-stats`);
    },

    trades(value) {
      const payload = {currency: this.currency, trades: value};
      this.$emit('uploadCurrencyTrades', payload);
    },

    filterDate() {
      this.uploadTrades({ protoNo: this.protoNo, baseCurrency: this.currency })
    }
  }
}
</script>
