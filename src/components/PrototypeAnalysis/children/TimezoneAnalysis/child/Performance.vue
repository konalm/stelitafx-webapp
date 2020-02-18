<template>
  <div>
    <p> Trades {{ trades.length }} </p>
    <p class="text-success"> {{ pipsGained }} </p>
    <p class="text-danger"> {{ pipsLost }} </p>

    <!-- <b-table class="mt-2" striped hover :items="tradesFormatted(trades)" /> -->
  </div>
</template>

<script>
import { formatTime } from '@/services/utils'

export default {
  props: {
    trades: {
      type: Array,
      required: true
    }
  },

  computed: {
     pipsGained() {
      return this.trades.reduce((sum, trade) => {
        const v = trade.pips > 0 ? trade.pips : 0
        return sum + v
      }, 0)
    },

    pipsLost() {
      return this.trades.reduce((sum, trade) => {
        const v = trade.pips < 0 ? trade.pips * -1 : 0
        return sum + v
      }, 0)
    },
  },

  methods: {
     tradesFormatted(trades) {
      return trades.map(x => ({
        openDate: formatTime(x.openDate),
        closeDate: formatTime(x.closeDate),
        pips: x.pips
      }))
    },
  }
}
</script>

<style>

</style>