<template>
  <b-row>
    <line-graph :dataPoints="adxLineGraphData"
      :details="adxLineGraphDetails"
      domClassName="simulator-adx-line-graph"
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
    adxLineGraphData() {
      return [...this.periods].map((x) => ({
        date: x.date,
        plusDi: x.adx.plusDi,
        minusDi: x.adx.minusDi,
        adx: x.adx.adx
      }))
    },

    adxLineGraphDetails() {
      return [
        {
          key: 'plusDi',
          colour: 'green',
          width: 1
        },
        {
          key: 'minusDi',
          colour: 'red',
          width: 1
        },
        {
          key: 'adx',
          colour: 'black',
          width: 1
        }
      ]
    },
  }
}
</script>

<style>

</style>