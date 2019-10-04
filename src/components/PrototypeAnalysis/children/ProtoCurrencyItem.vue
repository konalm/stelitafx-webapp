<template>
  <b-col class="px-5">
    {{ currency }}

    <div class="bar-graph" v-bind:class="`${currency}-stats`"></div>

    <router-link :to="{name: 'PrototypeCurrencyAnalysis', params: {
      no: protoNo,
      interval: timeInterval,
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
    protoNo: {
      type: Number,
      required: true
    },
    currency: {
      type: String,
      required: true,
      default: ''
    },
    timeInterval: {
      type: Number,
      required: true,
    },
    trades: {
      type: Array,
      required: true,
      default: []
    }
  },

  data() { return {} },

  computed: {
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

  methods: {
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
