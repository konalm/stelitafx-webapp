<template>
  <b-col>
    {{ currency }}
    {{ protoNo }}
    <div class="bar-graph GBP-stats" v-bind:class="`${currency}-stats`"></div>
  </b-col>
</template>


<script>
import { getHttpRequest } from '@/http/apiRequestV2';
import { buildBarGraph, clearBarGraph } from '@/graph/barGraph';
import groupOrdersIntoTrades from '@/services/groupOrdersIntoTrades';
import pipCalculator from '@/services/pipCalculator';

export default {
  props: {
    protoNo: 0,
    currency: '',
  },

  data() {
    return {
      trades: [],
    }
  },

  computed: {
    totalPips() {
      let gained = 0;
      let loss = 0;
      this.trades.forEach((trade) => {
        const pip = pipCalculator(trade.openRate, trade.closeRate);
        if (pip > 0) gained += pip
        if (pip < 0) loss += pip * -1
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
    },
  },

  mounted() {
    this.uploadTradeOrders();
  },

  methods: {
    profitTrades() {
      return this.trades.filter((trade) =>
        pipCalculator(trade.openRate, trade.closeRate) > 0
      )
    },

    lossTrades() {
      return this.trades.filter((trade) =>
        pipCalculator(trade.openRate, trade.closeRate) > 0
      )
    },

    uploadTradeOrders(date = null) {
      let url = `/proto/${this.protoNo}/currency/${this.currency}`;
      if (date) url += `?date=${date.toISOString()}`

      getHttpRequest(url)
        .then(res => {
          this.trades = res;
          const payload = {currency: this.currency, trades: res};

          this.$emit('uploadCurrencyTrades', payload);
        })
    },
  },

  watch: {
    graphData(value) {
      clearBarGraph(`${this.currency}-stats`);
      buildBarGraph(value, `${this.currency}-stats`);
    }
  }
}
</script>
