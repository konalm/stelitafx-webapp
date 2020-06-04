<template>
  <div>
    <line-graph :dataPoints="lineGraphRatesWma" :details="lineGraphRatesWmaDetails"
      :domClassName="domClassName"
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
    },

    domClassName: {
      type: String,
      default: ''
    }
  },

  computed: {
     lineGraphRatesWma() {
      return [...this.periods].map((x) => ({
        date: x.date,
        rate: x.exchange_rate,
        wma5: x.wma[5],
        wma15: x.wma[15]
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
          key: 'wma5',
          colour: 'blue',
          width: 1
        },
        {
          key: 'wma15',
          colour: 'red',
          width: 1
        }
      ]
    },
  }
}
</script>
