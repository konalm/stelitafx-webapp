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
    },

    width: {
      type: Number,
      default: 950,
      required: false
    },

    height: {
      type: Number,
      default: 400,
      required: false
    },

    xTicks: {
      type: Number,
      default: 50,
      required: false
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
      if (!this.graphFormattedData) return 

      clearLineGraph(this.domClassName);
      buildLineGraph(
        this.graphFormattedData, 
        this.domClassName, 
        this.width, 
        this.height, 
        this.xTicks
      )
    }
  },


  watch: {
    'graphFormattedData.dataPoints': function () {
      this.updateGraph()
    }
  }
}
</script>
