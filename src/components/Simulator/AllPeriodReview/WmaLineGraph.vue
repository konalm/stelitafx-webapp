<template>
  <b-row>
    <line-graph :dataPoints="lineGraphRatesWma" 
      :details="lineGraphRatesWmaDetails"
      domClassName="simulator-prices-wma-line-graph" 
    />
  </b-row>
</template>

<script>
import LineGraph from '@/components/patterns/LineGraph';

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

  data() {
    return {}
  },

  computed: {
     lineGraphRatesWma() {
      return [...this.periods].map((x) => ({
        date: x.date,
        rate: x.exchange_rate,
        wma5: x.wma[5],
        wma12: x.wma[12],
        wma36: x.wma[36],
        wma100: x.wma[100],
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
          key: 'wma5',
          colour: 'orange',
          width: 1
        },
        {
          key: 'wma12',
          colour: 'green',
          width: 1
        },
        {
          key: 'wma36',
          colour: 'blue',
          width: 1
        },
        {
          key: 'wma100',
          colour: 'purple',
          width: 2
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
