<template>
  <div>
    <div :id="domId" />
  </div>
</template>


<script>
import { buildLineGraph, clearLineGraph} from '@/graph/lineGraph'

export default {
  props: {
    domId: {
      type: String,
      required: true
    },
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
    lineGraphData() {
      if (!this.data) return

      const dataPoints = this.data.map((dataPoint) => ({
        date: dataPoint.date,
        macd: dataPoint.macdLine,
        macdLag: dataPoint.macdLag,
      }));

      let details = [
        {
          key: 'macd',
          colour: 'red',
          width: 1
        },
        {
          key: 'macdLag',
          colour: 'blue',
          width: 1
        }
      ]
      
      return { dataPoints, details }
    },
  },

  methods: {
    updateLineGraph() {
      if (!this.lineGraphData) return 

      clearLineGraph(this.domId);
      buildLineGraph(this.lineGraphData, this.domId, 1310, 250, 50)
    }
  },

  watch: {
    lineGraphData: {
      immediate: true,
      handler: function() {
        this.updateLineGraph()
      }
    }
  }
}
</script>