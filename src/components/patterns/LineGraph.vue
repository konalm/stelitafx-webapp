<template>
  <section>
    <div v-bind:id="domClassName"></div>
    <b-spinner variant="primary" label="Spinning" v-if="loading" />
  </section>
</template>


<script>
import { buildLineGraph, clearLineGraph } from '@/graph/lineGraph';

export default {
  props: {
    domClassName: {
      type: String,
      default: 'line-graph'
    },

    dataPoints: {
      type: Array,
      default: []
    },

    details: {
      type: Array,
      default: false 
    }
  },

  data() {
    return {
      loading: false
    }
  },

  mounted() {
    this.updateGraph()
  },

  computed: {
    graphFormattedData() {
      if (!this.dataPoints.length) return 
 
      return { dataPoints: this.dataPoints, details: this.details }
    }
  },

  methods: {
    updateGraph() {
      clearLineGraph(this.domClassName);
      buildLineGraph(this.graphFormattedData, this.domClassName, 950, 400)
    }
  },


  watch: {
    'graphFormattedData.dataPoints': function () {
      this.updateGraph()
    }
  }
}
</script>
