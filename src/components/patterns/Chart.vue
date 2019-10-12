<template>
  <section>
    <b-row>
      <b-col cols=11>
        <div v-bind:id="domClassName"></div>
      </b-col> 

      <b-col cols=1>
        <b-row class="mt-4 d-flex justify-content-center">
          <b-button variant="secondary" class="flex-grow-1"
            v-on:click="updateDataPointCount('decrement')"
          >
            <i class="fas fa-plus"></i> 
          </b-button> 

          <b-button variant="secondary" class='flex-grow-1 ml-1'
            v-on:click="updateDataPointCount('increment')"
          > 
            <i class="fas fa-minus"></i> 
          </b-button>
        </b-row>

        <b-row class="mt-4 d-flex justify-content-center">
          <b-button variant="secondary" class="flex-grow-1"
            v-on:click="updateOffset('increment')"
          >
            <i class="fas fa-chevron-left"></i>
          </b-button>

          <b-button variant="secondary" class="flex-grow-1 ml-1"
            v-on:click="updateOffset('decrement')"
          >
            <i class="fas fa-chevron-right"></i>
          </b-button>
        </b-row>
      </b-col>
    </b-row>
    
    <b-spinner variant="primary" label="Spinning" v-if="loading" />
  </section>
</template>


<script>
import { buildLineGraph, clearLineGraph } from '@/graph/lineGraph';
import { getHttpRequest } from '@/http/apiRequestV2';

export default {
  props: {
    currency: {
      type: String,
      required: true,
    },

    prototype: {
      type: Number,
      required: true
    },

    timeInterval: {
      type: Number,
      required: true
    }
  },

  data() {
    return {
      quoteCurrency: '',
      wmaDataPoints: [],
      loading: false,
      dataPointCount: 40,
      offset: 0
    }
  },

  beforeMount() {
    this.uploadWmaDataPoint()
    // this.refreshWMADatapoints()
  },

  computed: {
    domClassName() {
      return `linegraph`
    },

    lineGraphData() {
      if (!this.wmaDataPoints) return

      const wmaDataPoints = [...this.wmaDataPoints]
      const dataPoints = wmaDataPoints.map((dataPoint) => ({
        date: dataPoint.date,
        rate: dataPoint.rate,
        fiveWMA: dataPoint.WMAs["5"],
        twelveWMA: dataPoint.WMAs["12"],
        fifteenWMA: dataPoint.WMAs["15"],
        thirtySixWMA: dataPoint.WMAs["36"]
      }));

      const details = [
        {
          key: 'rate',
          colour: 'black',
          width: 1,
        }, {
          key: 'fiveWMA',
          colour: 'purple',
          width: 1
        }, {
          key: 'twelveWMA',
          colour: 'blue',
          width: 2
        }, {
          key: 'fifteenWMA',
          colour: 'rgba(0, 122, 255, 0.4)',
          width: 1
        }, {
          key: 'thirtySixWMA',
          colour: 'red',
          width: 2
        }
      ];

      return {dataPoints, details}
    }
  },

  methods: {
    updateOffset(direction) {
      if (direction === 'increment') this.offset += 4
      else if (direction === 'decrement') {
        if (this.offset <=4) this.offset = 0
        else this.offset -= 4
      }
      else throw new Error(`update offset, direction ${direction} not recognized`)
    },

    updateDataPointCount(direction) {
      if (direction === 'increment') this.dataPointCount += 10
      else if (direction === 'decrement') {
        this.dataPointCount -= 10
        if (this.dataPointCount < 0) this.dataPointCount = 0
      } 
      else throw new Error(`update data points, direction ${direction} not recognized`)
    },

    uploadWmaDataPoint() {
      this.loading = true

      if (!this.currency) return

      const payload = {
        currency: this.currency,
        timeInterval: this.timeInterval,
        count: this.dataPointCount,
        offset: this.offset
      }
      this.$store.dispatch('currencyRate/getCurrencyRateWmaData', payload)
        .then(res => {
          this.wmaDataPoints = res;
        })
        .finally(() => this.loading = false)
    },

    refreshWMADatapoints() {
      setInterval(() => {
        this.uploadWmaDataPoint()
      }, 15000)
    },

    updateGraph() {
      if (!this.lineGraphData) return 

      try {
        clearLineGraph(this.domClassName);
      } catch (e) {
        throw new Error(`Failed to clear graph: ${e}`)
      }

      buildLineGraph(this.lineGraphData, this.domClassName, 1200, 500)
    }
  },

  watch: {
    lineGraphData(value) { this.updateGraph() },

    timeInterval() { this.uploadWmaDataPoint() },

    dataPointCount() { this.uploadWmaDataPoint() },

    offset() { this.uploadWmaDataPoint() }
  }
}
</script>