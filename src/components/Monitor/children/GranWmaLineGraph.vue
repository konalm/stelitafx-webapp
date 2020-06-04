<template>
  <div v-if="lineGraphRateWma">
    <line-graph :dataPoints="lineGraphRateWma" :details="lineGraphRateWmaDetails"
      :domClassName="`Gran__${gran}__ratewmagraph`"
    />
  </div>
</template>

<script>
import LineGraph from '@/components/patterns/LineGraph'
import { fetchSymbolGranWMA } from '@/http/wma'

export default {
  components: {
    LineGraph
  },

  props: {
    gran: {
      type: String,
      required: true
    },
    symbol: {
      type: String, 
      required: true
    }
  },

  data() {
    return {
      rateWma: []
    }
  },

  beforeMount() {
    this.uploadRateWma()
  },

  computed: {
    lineGraphRateWma() {
      return [...this.rateWma].map((x) => {
        return {
          date: x.date,
          rate: x.rate,
          wma5: x.WMAs[5],
          wma15: x.WMAs[15]
        }
      })
    },

    lineGraphRateWmaDetails() {
      return [
        {
          key: 'rate',
          colour: 'black',
          width: 1,
        },
        {
          key: 'wma5',
          colour: 'blue',
          width: 1
        },
        {
          key: 'wma15',
          colour: 'red',
          width: 1
        }
      ]
    }
  },

  methods: {
    uploadRateWma() {
      fetchSymbolGranWMA(this.symbol, this.gran, '2020-06-01T00:00:00.000Z')()
        .then(res => {
          console.log('fetch symbol gran wma res --> ' + this.gran )
          console.log(res)

          this.rateWma = res
        })
    }
  },

  watch: {
    gran() {
      this.uploadRateWma()
    },

    symbol() {
      this.uploadRateWma()
    }
  }
  
}
</script>