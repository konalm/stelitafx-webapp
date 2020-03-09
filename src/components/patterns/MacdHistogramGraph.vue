<template>
  <div>
    <div v-bind:id="graphDomId" />
  </div>  
</template>


<script>
import Moment from 'moment';
import { buildBarGraph, clearBarGraph } from '@/graph/macdHistogramBarGraph'

export default {
  props: {
    data: {
      type: Array,
      required: true
    }
  },

  data() {
    return {}
  },

  mounted() {
    this.updateLineGraph()
  },

  computed: {
    graphDomId() {
      return 'macdHistogramBarGraph'
    },

    graphData() {
      if (!this.data) return

      return this.data
        .sort((a, b) => new Date(a.date) - new Date(b.date))
        .map((x) => ({
          label: Moment(x.date).format("HH:mm"),
          value: x.histogram,
          absValue:  Math.abs(x.histogram)
        }))
    }
  },

  methods: {
    updateLineGraph() {
      if (!this.graphData) return 

      clearBarGraph(this.graphDomId)
      buildBarGraph(this.graphData, this.graphDomId, 1310, 150)
    }
  },

  watch: {
    graphData: {
      immediate: true,
      handler: function() {
        this.updateLineGraph()
      }
    }
  }
}
</script>


<style>
#macdHistogramBarGraph rect.above {
  fill: royalblue;
}

#macdHistogramBarGraph rect.below {
  fill: rosybrown;
}

#macdHistogramBarGraph .x-axis text {
  margin-top: 30px;
  padding-top: 30px;
  font-weight: bold;
  fill: black;
  writing-mode: vertical-lr;
  -webkit-writing-mode: vertical-lr;
  -ms-writing-mode: vertical-lr;
  transform: translate(0px,-40px);
}
</style>