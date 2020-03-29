<template>
  <div>
    <div v-bind:id="domId"></div>
  </div>
</template>


<script>
import { buildLineGraph, clearLineGraph } from '@/graph/lineGraph'

export default {
  props: {
    periods: {
      type: Array,
      required: true
    },

    trade: {
      type: Object,
      required: true
    }
  },

  data() {
    return {
      domId: 'simulatedTradeGraph',
     }
  },

  computed: {
    formattedLineGraph() {
      if (!this.periods) return 
      if (!this.trade) return 

      const dataPoints = this.relevantPeriods.map((x) => ({
        date: x.date,
        rate: x.exchange_rate,
        twentyWMA: x.wma['20'],
        twoHundredWMA: x.wma['200']
      }))

      const details = [
        {
          key: 'rate',
          colour: 'black',
          width: 2,
        }, {
          key: 'twentyWMA',
          colour: 'blue',
          width: 1,
        }, {
          key: 'twoHundredWMA',
          colour: 'red',
          width: 1
        }
      ]

      return { dataPoints, details }
    },

    relevantPeriods() {
      const indexOfOpenPeriod = this.periods.findIndex((x) => 
        x.date === this.trade.open.date
      )
      const indexOfClosePeriod = this.periods.findIndex((x) => 
        x.date === this.trade.close.date
      )
      const buffer = 40

      return this.periods.filter(
        (x, i) => i >= indexOfOpenPeriod - 40 && i <= indexOfClosePeriod + 40
      )
    } 
  },

  methods: {
    updateLineGraph() {
      console.log('update line graph')

      if (!this.formattedLineGraph) return 

      console.log('build line graph !!')

      clearLineGraph(this.domId)
      buildLineGraph(this.formattedLineGraph, this.domId,  750, 250, 80)
    }
  },

  watch: {
    formattedLineGraph() {
      this.updateLineGraph()
    }
  }
}
</script>