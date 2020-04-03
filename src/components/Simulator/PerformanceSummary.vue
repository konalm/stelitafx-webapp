<template>
  <b-card>
    <p class="text-success"> {{ pipsGained }} </p> 
    <p class="text-danger">{{ pipsLost }} </p>
    <p> {{ totalPips }} </p>
    <p> trades {{ amountOfTrades }} </p>
    <p> per trade {{ pipsPerTrade }} </p>
  </b-card>
</template>

<script>
export default {
  props: {
    trades: {
      type: Array, 
      required: false,
      default: []
    }
  },

  computed: {
    amountOfTrades() {
      return this.trades.length
    },

    pipsGained() {
      return this.trades.reduce((sum, x) => sum + x.pips > 0 ? trade.pips : 0, 0)
    },

    pipsLost() {
      return this.trades.reduce((sum, x) => sum + x.pips < 0 ? trade.pips * -1 : 0, 0)
    },

    totalPips() {
      return this.pipsGained - this.pipsLost
    },

    pipsPerTrade() {
      return this.totalPips / this.amountOfTrades
    }
  }
}
</script>

<style>

</style>