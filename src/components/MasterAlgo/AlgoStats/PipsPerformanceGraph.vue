<template>
  <div v-bind:id="'pieGraph' + protoNo" class="my-3 text-center"></div>
</template>

<script>
import { buildPieGraph, clearPieGraph } from '@/graph/pieGraph';

export default {
  props: {
    protoNo: {
      type: Number,
      required: true
    },

    performance: {
      type: Object,
      default: {
        winning: 0,
        losing: 0
      }
    }
  },

  mounted() {
    this.drawGraph()
  },

  methods: {
    drawGraph() {
      clearPieGraph(this.protoNo)
      buildPieGraph(this.protoNo, this.performance.winning, this.performance.losing)
    }
  },

  watch: {
    performance() {
      this.drawGraph()
    }
  }
}
</script>

<style>

</style>


   