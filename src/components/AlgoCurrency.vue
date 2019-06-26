<template>
  <app-template>
    <p class="lead">Prototype: {{ algoId }}</p>
    <p class="lead">Currency: {{ baseCurrency }} / {{ quoteCurrency }}</p>

    <b-list-group class="mt-4">
      <b-list-group-item class="mt-5 p-4" v-for="trade in tradesGrouped">
        <b-list-group-item v-if="trade.hasOwnProperty('sell')" class="sell">
          <p>{{ formatDate(trade.sell.date) }}
            <span class="ml-2">{{ formatTime(trade.sell.date) }}</span>
          </p>

          <p class="lead">{{ trade.sell.rate }}</p>
        </b-list-group-item>

        <b-list-group-item v-if="trade.hasOwnProperty('buy')" class="buy mt-3">
          <p>{{ formatDate(trade.buy.date) }}
            <span class="ml-2">{{ formatTime(trade.buy.date) }}</span>
          </p>

          <p class="lead">{{ trade.buy.rate }}</p>
        </b-list-group-item>
      </b-list-group-item>
    </b-list-group>


    <b-alert show variant="warning" v-if="trades.length === 0 && tradesUploaded">
      No trades!
    </b-alert>
  </app-template>
</template>


<script>
import moment from 'moment';
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

  computed: {
    tradesGrouped() {
      const trades = this.trades

      if (trades.length === 0) return [];

      /* first trade needs to be a buy */
      if (trades[trades.length - 1].transaction === 'sell') {
        trades.splice(1, trades.length -1);
      }


      const tradesGrouped = [];
      for (var i = trades.length - 1; i > 0; i -= 2) {
        const buy = trades[i];
        const sell = trades[i - 1];
        const trade = { buy, sell };

        tradesGrouped.push(trade);
      }

      return tradesGrouped
    }
  },

  beforeMount() {
    this.algoId = this.$route.params.algoNo;
    this.baseCurrency = this.$route.params.currency;
    this.uploadCurrencyTrades();
  },


  methods: {
   /**
    *
    */
    formatDate(date) {
      return moment(date).format('DD/MM/YYYY')
    },

    formatTime(date) {
      return moment(date).format('HH:mm')
    },

    /**
     *
     */
    uploadCurrencyTrades() {
      getCurrencyTradesHttpRequest(this.algoId, this.baseCurrency)
        .then(res => {
          this.trades = res;
        })
        .finally(() => {
          this.tradesUploaded = true;
        })
    },


    /**
     *
     */
    tradeClass(transaction) {
      if (transaction === 'buy') {
        return 'bg-primary'
      }

      return 'bg-danger'
    }
  }
}
</script>


<style lang="scss" scoped>
.list-group-item {
  // border: none;
  // width: 90%;

  .list-group-item {
    &.buy {
      background: rgba(0,122,255,0.6);
      // margin-bottom: 50px;
      // float: left;
    }

    &.sell {
      background: rgba(215,46,61,0.6);
      // margin-left: 10%;
      // float: right;
    }
  }
}
</style>
