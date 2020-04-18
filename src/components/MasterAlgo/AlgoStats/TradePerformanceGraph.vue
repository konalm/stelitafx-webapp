<template>
  <div>
    <div class='bar-graph' v-bind:class="domClassName"></div>
  </div>
</template>


<script>
import { buildBarGraph, clearBarGraph } from '@/graph/barGraph';

export default {
  props: {
    protoNo: {
      type: Number,
      required: true,
    },
    performance: {
      type: Object,
      default: {
        winning: 0,
        losing: 0
      }
    },
    domClass: {
      type: String,
      required: true
    }
  },

  mounted() {
    this.buildTradeBarGraph()
  },

  computed: {
    domClassName() {
      return `${this.domClass}-${this.protoNo}`
    }
  },

  methods: {
    buildTradeBarGraph() {
      const graphData = [
        { label: 'W', value: this.performance.winning },
        { label: 'L', value: this.performance.losing }
      ]
      clearBarGraph(this.domClassName)
      buildBarGraph(graphData, this.domClassName)
    }
  },

  watch: {
    performance() {
      this.buildTradeBarGraph()
    },
  }
}
</script>