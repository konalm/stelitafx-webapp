<template>
  <b-col cols="3" class="my-3">
    <b-card>
      <p> <b> {{ dateFormatted }} </b> </p>

      <b-card-text class="mt-2">
        <p> Trades {{ tradeAmount }} </p>    
        <p> Gain {{ pipsGained }} | Lost {{ pipsLost }} </p>
        <p>  {{ performance }} </p>
        <p> Average per trade {{ avgPipsPerTrade }} </p>
      </b-card-text>
    </b-card>
  </b-col>
</template>

<script>
import moment from 'moment';

export default {
  props: {
    date: {
      required: true,
      type: Date,
    },
    trades: {
      required: false,
      type: Array
    }
  },

  computed: {
    dateFormatted() {
      return moment(this.date).format('DD MM YYYY')
    },

    tradeAmount() {
      if (!this.trades) return 0

      return this.trades.length
    },

    pipsGained() {
      if (!this.trades || !this.trades.length) return 0; 

      const gained =  this.trades.reduce((sum, trade) => {
        const v = trade.pips > 0 ? trade.pips : 0
        return sum + v
      }, 0)

      return gained.toFixed(0)
    },

    pipsLost() {
      if (!this.trades || !this.trades.length) return 0; 

      const lost = this.trades.reduce((sum, trade) => {
        const v = trade.pips < 0 ? trade.pips * -1 : 0
        return sum + v
      }, 0)

      return lost.toFixed(0)
    },

    performance() {
      return this.pipsGained - this.pipsLost
    },

    avgPipsPerTrade() {
      return (this.tradeAmount / this.performance).toFixed(2)
    }
  }
}
</script>

<style>

</style>