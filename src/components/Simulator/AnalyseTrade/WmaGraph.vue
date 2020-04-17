<template>
  <div>
    <line-graph :dataPoints="lineGraphRatesWma"
      :details="lineGraphRatesWmaDetails"
      domClassName="simulator_trade-analysis_wma"
    />
  </div>
</template>

<script>
import LineGraph from '@/components/patterns/LineGraph'

export default {
  components: {
    LineGraph
  },

  props: {
    periods: {
      type: Array,
      default: []
    }
  },

  computed: {
     lineGraphRatesWma() {
      return [...this.periods].map((x) => ({
        date: x.date,
        rate: x.exchange_rate,
        wma150: x.wma[150],
        wma200: x.wma[200]
      }))
    },

    lineGraphRatesWmaDetails() {
      return [
        {
          key: 'rate',
          colour: 'black',
          width: 1
        },
        {
          key: 'wma150',
          colour: 'blue',
          width: 1
        },
        {
          key: 'wma200',
          colour: 'red',
          width: 1
        }
      ]
    },
  }
}
</script>
