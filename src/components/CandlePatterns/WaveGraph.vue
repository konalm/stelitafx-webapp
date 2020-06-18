<template>
  <line-graph :dataPoints="waves" :details="details" 
    domClassName="wave__line-graph" 
    :width="1300"
    :height="450"
    :xTicks="200"
  />
</template>

<script>
import LineGraph from '@/components/patterns/LineGraph'
import { fetchWaves } from '@/http/candles'

export default {
  components: {
    LineGraph
  },

  props: {
    gran: {
      type: String,
      default: 'M5',
    },
    symbol: {
      type: String,
      default: 'EURUSD'
    },
    apiReqQuery: {
      type: Object,
      default: function() {
        return {
          count: 0,
          offset: 0,
          startDate: null,
          endDate: null,
          buffer: 50
        }
      }
    }
  },

  data() {
    return {
      waves: [],
      details: [
        {
          key: 'value',
          colour: 'black'
        }
      ]
    }
  },

  beforeMount() {
    this.uploadWaves()
  },

  methods: {
    uploadWaves() {
      fetchWaves(this.symbol, this.gran, this.apiReqQuery)
        .then(res => {
          this.waves = res 
        })
    },
  }
}
</script>