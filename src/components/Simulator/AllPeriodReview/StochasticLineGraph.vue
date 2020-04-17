<template>
  <b-row>
    <line-graph :dataPoints="stochasticLineGraphData"
      :details="stochasticLineGraphDetails"
      domClassName="simulator-stochastic-line-graph"
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
    stochasticLineGraphData() {
      return [...this.periods].map((x) => ({
        date: x.date,
        stochastic: x.stochastic,
        twenty: 20,
        eighty: 80
      }))
    },

    stochasticLineGraphDetails() {
      return [
        {
          key: 'stochastic',
          colour: 'blue',
          width: 1
        },
        {
          key: 'twenty',
          colour: 'grey',
          width: 1
        },
        {
          key: 'eighty',
          colour: 'grey',
          width: 1
        }
      ]
    },
  }
}
</script>

<style>

</style>