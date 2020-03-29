<template>
  <div>
    <div :id="domId" class="line-graph" />
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
        zero: 0.00,
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
        },
        {
          key: 'zero',
          colour: 'black',
          width: 1.4
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