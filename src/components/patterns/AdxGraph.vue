<template>
  <div>
    <!-- {{ periods }} -->
    <div :id="domId" class="line-graph"></div>
  </div>
</template>

<script>
import { buildLineGraph, clearLineGraph } from '@/graph/lineGraph';


export default {
  props: {
    periods: {
      type: Array,
      required: false
    },

    domId: {
      type: String,
      required: true
    }
  },

  data() {
    return {
      candles: []
    }
  },

  computed: {
    formattedDataForLineGraph() {
      if (!this.periods || !this.periods.length) return

      const dataPoints = this.periods.map((dataPoint) => ({
        date: dataPoint.date,
        adx: dataPoint.adx,
        plusDi: dataPoint.plusDi,
        minusDi: dataPoint.minusDi,
        trendLine: 20
      }))

      const details = [
        {
          key: 'trendLine',
          colour: 'black',
          width: 1
        },
        {
          key: 'adx',
          colour: 'blue',
          width: 2
        },
        {
          key: 'plusDi',
          colour: 'green',
          width: 1
        },
        {
          key: 'minusDi',
          colour: 'red',
          width: 1
        }
      ]

      console.log('adx line graph >>>')
      console.log(  { dataPoints, details } )

      return { dataPoints, details }
    },
  },

  methods: {
    updateLineGraph() {
      if (!this.formattedDataForLineGraph) return

      clearLineGraph(this.domId)

      buildLineGraph(
        this.formattedDataForLineGraph,
        this.domId,
        1310,
        250,
        50
      )
    },
  },

  watch: {
    formattedDataForLineGraph: {
      immediate: true,
      handler: function() {
        this.updateLineGraph()
      }
    }
  }
}
</script>

<style>

</style>