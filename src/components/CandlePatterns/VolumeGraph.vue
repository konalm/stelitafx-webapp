<template>
  <div>
    <div v-bind:id="graphDomId" class="volume-graph" />
  </div>
</template>

<script>
import Moment from 'moment';
import { fetchVolume } from '@/http/candles'
import { buildBarGraph, clearBarGraph } from '@/graph/macdHistogramBarGraph'



export default {
  props: {
    gran: {
      type: String,
      default: 'M5',
    },
    symbol: {
      type: String,
      default: 'GBPUSD'
    },
    apiReqQuery: {
      type: Object,
      default: function() {
        return {
          count: 0,
          offset: 0,
        }
      }
    }
  },

  data() {
    return {
      volume: [],
      graphDomId: 'VolumeGraph'
    }
  },

  beforeMount() {
    this.uploadVolume()
  },

  computed: {
    graphData() {
      if (!this.volume) return 

      return this.volume
        .sort((a, b) => new Date(a.date) - new Date(b.date))
        .map((x) => ({
          label: Moment(x.date).format("HH:mm"),
          value: x.volume,
          absValue: x.volume
        }))
    },
  },

  methods: {
    uploadVolume() {
      fetchVolume(this.symbol, this.gran, this.apiReqQuery)
        .then(res => {
          this.volume = res
        })
    },

    updateGraph() {
      if (!this.graphData) return 

      clearBarGraph(this.graphDomId)
      buildBarGraph(this.graphData, this.graphDomId, 1310, 300)
    }
  },

  watch: {
    graphData: {
      immediate: true,
      handler: function() {
        this.updateGraph()
      }
    }
  }
}
</script>

<style scoped>
.volume-graph {
  margin-left: -17px;
}
</style>