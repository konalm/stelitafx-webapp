<template>
  <b-container class="oanda__container mt-4">
    <b-row> 
      <b-col>
        <p class="lead">OANDA</p> 
      </b-col>
    </b-row>

    <b-row class="oanda__row mt-3" v-if="!transactionsNotFound">
      <!-- open -->
      <b-col v-if="openTransaction">
        <b-card class="buy" v-if="openTransaction">
          <p> {{ openTransaction.price }} 
            <u>
              <small>(Difference from stelta: 
                {{ calcPip(trade.openRate, openTransaction.price) }})
              </small>
            </u>
          </p>
          
          <p> {{ formatDateTime(openTransaction.time) }} </p>

          <p class="mt-2"> bids: </p>

          <p v-for="(bid, index) in openTransaction.bids" :key="index">
            {{ bid.price }} 
            
            <u> 
              <small> 
                (Difference from stelita: {{ calcPip(trade.openRate, bid.price) }})
              </small>
            </u>
          </p>
        </b-card>
      </b-col>

      <!-- close -->
      <b-col v-if="closeTransaction">
        <b-card class="sell">
          <p> {{ closeTransaction.price }}
            <u>
              <small>
                (Difference from stelita: 
                {{ calcPip(trade.closeRate, closeTransaction.price)  }})
              </small>
            </u>
          </p>

          <p>{{ formatDateTime(closeTransaction.time) }} </p>

          <p class="mt-2"> bids: </p>

          <p v-for="(bid, index) in closeTransaction.bids" :key="index"> 
            {{ bid.price }} 
            <u>
              <small>
                (Difference from stelita: {{ calcPip(trade.closeRate, bid.price) }})
              </small>
            </u>
          </p>
        </b-card>
      </b-col>

      <!-- summary -->
      <b-col v-if="openTransaction && closeTransaction"> 
        <b-card class="summary">
          <p> 
            <!-- {{ calcPip(openTransaction.price, closeTransaction.price) }}  -->
          </p>

          <p v-if="openTransaction.bids.length"> 
            If got bid price: 
            {{ calcPip(openTransaction.bids[0].price, closeTransaction.price) }}
          </p>
        </b-card>
      </b-col>
    </b-row>

    <b-row v-if="transactionsNotFound" class="mt-3">
      <b-col> 
        <b-alert variant="danger" show> Oanda transactions not found! </b-alert>
      </b-col> 
    </b-row>
  </b-container>
</template>

<script>
import { getHttpRequest } from '@/http/apiRequestV2';
import pipCalculator from '@/services/pipCalculator';
import { formatDateTime } from '@/services/utils';


export default {
  props: {
    tradeId: {
      type: [Number, String], 
      required: true
    },
    trade: {
      type: Object,
      required: true
    },
  },

  data() {
    return {
      openTransaction: {
        price: 0,
        time: '',
        bids: []
      },
      closeTransaction: {
        price: 0,
        time: '',
        bids: []
      },
      transactionsNotFound: false
    }
  },

  beforeMount() {
    this.uploadTransactions()
  },

  methods: {
    formatDateTime(dateTime) { return formatDateTime(dateTime) },

    calcPip(a, b) { return pipCalculator(a, b) },

    uploadTransactions() {
      const path = `oanda-trade-transactions/${this.tradeId}`
      getHttpRequest(path)
        .then(res => {
          console.log('<-- OANDA trade transactions res -->')
          console.log(res)

          const openTransaction = res.openTradeTransaction
          this.openTransaction.price = openTransaction.price
          this.openTransaction.time = openTransaction.time
          this.openTransaction.bids = openTransaction.fullPrice.bids

          const closeTransaction = res.closeTradeTransaction
          this.closeTransaction.price = closeTransaction.price 
          this.closeTransaction.time = closeTransaction.time
          this.closeTransaction.bids = closeTransaction.fullPrice.bids
        })
        .catch (e => {
          this.transactionsNotFound = true
        })
    },
  }
}
</script>

<style>

</style>