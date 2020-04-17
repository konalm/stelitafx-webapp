<template>
  <li class="list-group-item">
    <p class="mb-2"> {{ description }} </p>
    <p> <small> pips {{ performance.pips }} </small> </p>
    <p> <small> trades {{ performance.tradeAmount }} </small> </p>
    <p> <small> winning trades {{ performance.winningTrades }} </small> </p>
    <p> <small> losing trades {{ performance.losingTrades }} </small> </p>
    <p> <small> winning trade {{ performance.winPercentage }} % </small> </p>
    <p> <small>  avg pips per trade {{ performance.avgPipsPerTrade }} </small> </p>
  </li>
</template>

<script>
import { fetchAlgoStats } from '@/http/algos'

export default {
  props: {
    algoId: {
      type: Number,
      required: true
    },
  },

  data() {
    return {
      description: '',
      performance: {
        tradeAmount: 0,
        pips: 0,
        winningTrades: 0,
        losingTrades: 0,
        avgPipsPerTrade: 0,
        winPercentage: 0
      }
    }
  },

  beforeMount() {
    this.uploadStats()
  },

  methods: {
    uploadStats() {
      fetchAlgoStats(this.algoId, 5)()
        .then(res => {
          this.description = res.description
          this.performance = res.performance
        })
    }
  }
}
</script>

<style>

</style>