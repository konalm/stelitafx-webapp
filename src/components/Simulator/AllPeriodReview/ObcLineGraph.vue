<template>
  <b-row>
    <line-graph :dataPoints="obcLineGraphData"
      :details="obcLineGraphDetails"
      domClassName="simulator-obc-line-graph"
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
    obcLineGraphData() {
      const x =  [...this.periods].map((x) => ({
        date: x.date,
        obc: x.obc.obc,
        // wma10: x.obc.wma[10],
        zeroThreshold: 0,
        // wma20: x.obc.wma[20],
        wma100: x.obc.wma[100]
      }))

      return x
    },

    obcLineGraphDetails() {
      return [
        {
          key: 'obc',
          colour: 'black',
          width: 1
        },
        {
          key: 'zeroThreshold',
          colour: 'grey',
          width: 1
        },
        {
          key: 'wma100',
          colour: 'red',
          width: 1
        }
      ]
    }
  }
}
</script>
