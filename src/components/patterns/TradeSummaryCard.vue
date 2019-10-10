<template>
  <li class="list-group-item" v-bind:class="{
    'viewed': trade.viewed,
    'in-view': inView}"
    v-on:click="redirectToTrade()"
  >
    <!-- header -->
    <div class="row">
      <div class="col header p-2">
        {{ trade.id }}
        
        <p> 
          Paper   
          <span class="ml-2" v-bind:class="{
            'text-success': trade.pips > 0,
            'text-danger': trade.pips < 0
          }">
            <b>{{ trade.pips }}</b>
          </span>
        </p>

        <p v-if="trade.account === 'demo'">
          Oanda 
          <span class="ml-2" v-bind:class="{
            'text-success': oandaPips > 0,
            'text-danger': oandaPips < 0
          }">
            <b>{{ oandaPips }}</b>
          </span>
        </p>

        <p>{{ duration }}</p>

        <p class="p-2" v-bind:class="{'bg-info': trade.account === 'demo'}">
          Account: {{ trade.account }}
        </p>



        <p>TI {{ trade.timeInterval }}</p>

        <p v-if="!summary">{{ formatDate(trade.closeDate) }}
          {{ formatTime(trade.closeDate) }}
        </p>
      </div>
    </div>

    <div class="row p-2">
      <!-- close -->
      <div class="col sell rounded py-2">
        <p>
          <b>
            {{ formatDate(trade.closeDate) }}
            <span class="ml-2">{{ formatTime(trade.closeDate) }}</span>
          </b>
        </p>

        <p class="lead" v-if="!summary"> <i class="fas fa-arrow-down"></i>
          {{ trade.closeRate }} </p>
      </div>

      <div class="mx-1"></div>

      <!-- open -->
      <div class="col buy rounded py-2" v-if="!summary">
        <p>
          <b>{{ formatDate(trade.openDate) }}
            <span class="ml-2">{{ formatTime(trade.openDate) }}</span>
          </b>
        </p>

        <p class="lead"> <i class="fas fa-arrow-up"></i>
          {{ trade.openRate }}
        </p>
      </div>
    </div>

    <b-alert variant="danger mt-1" show v-if="oandaTransactionsNotFound">
      {{ oandaTransactionsNotFound }}
    </b-alert>
  </li>
</template>


<script>
import moment from 'moment'
import { durationOfTrade } from '@/services/utils'
import { getHttpRequest } from '@/http/apiRequestV2';
import pipCalculator from '@/services/pipCalculator';


export default {
  props: {
    trade: Object,
    summary: {
      type: Boolean,
      required: false,
      default: false
    },
    inView: {
      type: Boolean,
      required: false,
      default: true
    },
    prototypeNo: {
      type: Number,
      required: false
    }
  },

  data() {
    return {
      subView: 1,
      oandaOpenTransaction: {
      price: 0,
      time: '',
      bids: []
    },
    oandaCloseTransaction: {
      price: 0,
      time: '',
      bids: []
    },
    }
  },

  beforeMount() {
    this.uploadOandaTradeTransactions()
  },

  computed: {
    oandaPips() {
      return pipCalculator(
        this.oandaOpenTransaction.price, 
        this.oandaCloseTransaction.price
      )
    },

    duration() {
      return durationOfTrade(this.trade.openDate, this.trade.closeDate)
    },

    currency() {
      return this.$route.params.currency;
    },

    oandaTransactionsNotFound() {
      if (this.trade.account === 'demo') {
        if (!this.trade.oandaOpenTradeId && !this.trade.oandaCloseTradeId) {
          return 'Oanda transactions not found!';
        }

        if (!this.trade.oandaOpenTradeId) return 'Oanda open transaction not found!';
        if (!this.trade.oandaCloseTradeId) return 'Oanda close transaction not found!';
      }

      return '';
    }
  },

  methods: {
    formatDate(date) { return moment(date).format('DD/MM/YYYY') },

    formatTime(date) { return moment(date).format('HH:mm') },

    redirectToTrade() {
      this.$router.push({
        name: 'TradeAnalysis',
        params: {
          protoNo: this.prototypeNo,
          interval: this.trade.timeInterval,
          currency: this.currency,
          tradeId: this.trade.id
        }
      })
    },

    uploadOandaTradeTransactions() {
      const path = `/oanda-trade-transactions/${this.trade.id}`
      getHttpRequest(path)
        .then(res => {
          this.oandaOpenTransaction = res.openTradeTransaction
          this.oandaCloseTransaction = res.closeTradeTransaction
        })
        .catch(e => {
          console.error(`Failed to upload oanda trade transations: ${e}`)
        })
    }
  }
}
</script>


<style lang="scss" scoped>
.list-group-item {
  cursor: pointer;

  &.in-view {
    box-shadow: 0 1px 5px rgba(0,0,0,0.3);
  }

}

.viewed {
  background: rgba(0,0,0,0.06);
}
</style>
