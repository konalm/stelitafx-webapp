<template>
  <section>
    <div v-bind:class="domClassName"></div>
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
    }
  },

  data() {
    return {
      quoteCurrency: '',
      wmaDataPoints: [],
      loading: false
    }
  },

  beforeMount() {
    this.uploadWmaDataPoint()
    this.refreshWMADatapoints()
  },

  computed: {
    timeInterval() {
      return this.$store.getters['timeInterval/interval']
    },

    domClassName() {
      return `${this.currency}-linegraph`
    },

    lineGraphData() {
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
    uploadWmaDataPoint() {
      this.loading = true

      if (!this.currency) return

      const path = `currency/${this.currency}/int/${this.timeInterval}/wma-data-points/40`
      getHttpRequest(path)
        .then(res => {
          this.wmaDataPoints = res
        })
        .finally(() => {
          this.loading = false
        })
    },

    refreshWMADatapoints() {
      setInterval(() => {
        this.uploadWmaDataPoint()
      }, 15000)
    }
  },

  watch: {
    lineGraphData(value) {
      clearLineGraph(this.domClassName);
      buildLineGraph(value, this.domClassName, 950, 400)
    },

    timeInterval() {
      this.uploadWmaDataPoint()
    }
  }
}
</script>

<style>

</style>