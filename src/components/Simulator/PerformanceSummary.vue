<template>
  <b-card>
    <p> W trades {{ winningTrades }} </p>
    <p> W avg trades {{ pipsPerWinningTrade }} </p>
    <p> L trades {{ losingTrades }} </p>
    <p> L avg trades {{ pipsPerLosingTrade }} </p>
    <p class="text-success"> {{ pipsGained }} </p> 
    <p class="text-danger">{{ pipsLost }} </p>
    <p> {{ totalPips }} </p>
    <p> trades {{ amountOfTrades }} </p>
    <p> trades per day {{ stats.tradesPerDay }}</p>
    <p> trades per week {{ tradesPerWeek }}</p>
    <p> per trade {{ pipsPerTrade }} </p>
    <p> Winning trade {{ winningTradePercentage }} % </p>
    <p> Losing trade {{ losingTradePercentage }} % </p>
  </b-card>
</template>

<script>
import { calcPercentangeOfGain } from '@/services/utils';

export default {
  props: {
    trades: {
      type: Array, 
      required: false,
      default: []
    },

    stats: {
      type: Object,
      required: false,
      default: {
        tradesPerDay: 0
      }
    }
  },

  computed: {
    amountOfTrades() {
      return this.trades.length
    },

    winningTrades() {
      return this.trades.reduce((winningTrades, x) =>
        winningTrades + (x.stats.pips > 0 ? 1 : 0), 0
      )
    },

    losingTrades() {
      return this.trades.reduce((losingTrades, x) =>
        losingTrades + (x.stats.pips < 0 ? 1 : 0), 0
      )
    },

    pipsGained() {
      return this.trades.reduce((sum, x) => 
        sum + (x.stats.pips > 0 ? x.stats.pips : 0), 0
      )
    },

    pipsLost() {
      return this.trades.reduce((sum, x) => 
        sum + (x.stats.pips < 0 ? x.stats.pips * -1 : 0), 0
      )
    },

    totalPips() {
      return this.pipsGained - this.pipsLost
    },

    pipsPerTrade() {
      return this.totalPips / this.amountOfTrades
    },

    pipsPerWinningTrade() {
      return this.pipsGained / this.winningTrades
    },

    pipsPerLosingTrade() {
      return this.pipsLost / this.losingTrades
    },

    tradesPerWeek() {
      return this.stats.tradesPerDay * 5
    },

    winningTradePercentage() {
      return calcPercentangeOfGain(this.winningTrades, this.losingTrades).toFixed(0)
    },

    losingTradePercentage() {
      return calcPercentangeOfGain(this.losingTrades, this.winningTrades).toFixed(0)
    }
  }
}
</script>

<style>

</style>