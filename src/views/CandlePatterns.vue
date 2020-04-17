<template>
  <app-template>
    <b-container>
      <svg id="candlePatternSimulator" />
      {{ x }}
    </b-container>
  </app-template>
</template>

<script>
import AppTemplate from '@/components/patterns/AppTemplate'
import { fetchCandlePatternSimulator } from '@/http/candles'
import { drawChart as drawCandlestickGraph, clearCandlestickGraph } from '@/graph/candlestickGraph'; 

const SINCEDATE = '2020-04-07T00:00:00.000Z'

export default {
  components: {
    AppTemplate
  },

  data() {
    return {
      candles: []
    }
  },  

  beforeMount() {
    this.uploadCandlePatternSimulator()
  },

  computed: {
    x() {
      const d = '2020-04-09T12:25:00.000Z'
      const z =  this.candles.find((x) => x.date === d )
      console.log(z)
      return z
    }
  },

  methods: {
    uploadCandlePatternSimulator() {
      fetchCandlePatternSimulator('GBPUSD', SINCEDATE)()
        .then(res => {
          this.candles = res
          // this.updateCandleStickGraph(res.splice(res.length - 10, res.length))
          this.updateCandleStickGraph(res)
        })
    },

    updateCandleStickGraph(candles) {
      clearCandlestickGraph('candlePatternSimulator')
      drawCandlestickGraph(candles, 'candlePatternSimulator')
    }
  }
}
</script>

<style>

</style>