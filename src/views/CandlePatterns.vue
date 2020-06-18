<template>
  <app-template>
    <b-container>
      <!-- <b-row>
        <b-col cols="3">
          <b-form>
            <b-form-group>
              <b-form-input v-model="startDate" placeholder="Start Date" />
            </b-form-group>

            <b-form-group>
              <b-form-input v-model="endDate" placeholder="End Date" />
            </b-form-group>

            <b-form-group>
              <b-button v-on:click="fetchData()" class="w-100"> Fetch </b-button>
            </b-form-group>
          </b-form>
        </b-col>
      </b-row> -->
      <!-- {{ candles.length }} -->
      <!-- {{ trends }} -->
  
      <svg id="candlePatternSimulator" />

      <volume-graph :symbol="symbol" :gran="gran" :apiReqQuery="apiReqQuery" 
        ref="volumeGraph" 
      />
      <svg id="heikienAshiCandles" />

      <b-button v-on:click="incOffset()"> Back </b-button>

      <wave-graph :gran="gran" :symbol="symbol" :count="count" 
        :offset="offset" 
        :apiReqQuery="apiReqQuery"
        ref="waveGraph"
      />

    </b-container>
  </app-template>
</template>


<script>
import AppTemplate from '@/components/patterns/AppTemplate'
import { 
  fetchCandlePatternSimulator, 
  getCandles,
  fetchHeikienAshiCandles,
  fetchWaves,
  fetchTrends
} from '@/http/candles'
import { drawChart as drawCandlestickGraph, clearCandlestickGraph } from '@/graph/candlestickGraph'; 
import WaveGraph from '@/components/CandlePatterns/WaveGraph'
import VolumeGraph from '@/components/CandlePatterns/VolumeGraph'

const SINCEDATE = '2020-04-07T00:00:00.000Z'

export default {
  components: {
    AppTemplate,
    WaveGraph,
    VolumeGraph
  },

  data() {
    return {
      candles: [],
      interval: 5,
      gran: 'M5',
      symbol: 'GBPUSD',
      count: 200,
      offset: 0,
      startDate: null, 
      endDate: null,
      buffer: 50,
      trends: []
    }
  },  

  async beforeMount() {
    // this.uploadCandlePatternSimulator()
    await this.uploadTrends()
    this.uploadCandles()
    this.uploadHeikienAshiCandles()
  },

  computed: {
    apiReqQuery() {
      return {
        count: this.count, 
        offset: this.offset,
        startDate: this.startDate,
        endDate: this.endDate,
        buffer: this.buffer
      }
    }
  },

  methods: {
    incOffset() {
      this.offset -= 50
      this.fetchData()
    },

    fetchData() {
      this.uploadCandles()
      this.uploadHeikienAshiCandles()
      this.$refs.waveGraph.uploadWaves()
      this.$refs.volumeGraph.uploadVolume()
    },

    uploadCandles() {
      getCandles(this.gran, this.symbol, this.apiReqQuery)
        .then(res => {
          const candles = res
          const startDate = '2020-06-15T13:30:00.000Z'
          const startDateIndex = candles.findIndex((x) => x.date === startDate )
          const percentageOfDate = (startDateIndex / candles.length) * 100

          const endDate = '2020-06-15T14:00:00.000Z'
          const endDateIndex = candles.findIndex((x) => x.date === endDate)
          const percentageOfEndDate = (endDateIndex / candles.length) * 100
          const scale = percentageOfEndDate - percentageOfDate 

          this.updateCandleStickGraph(res, 'candlePatternSimulator')
        })
    },

    uploadHeikienAshiCandles() {
      fetchHeikienAshiCandles(this.symbol, this.gran, this.apiReqQuery)
        .then(res => {
          this.updateCandleStickGraph(res, 'heikienAshiCandles')
        })
    },

    uploadTrends () {
      fetchTrends(this.symbol, this.gran, this.apiReqQuery)
        .then(res => {
          this.trends = res
        })
    },

    uploadCandlePatternSimulator() {
      fetchCandlePatternSimulator(this.symbol, SINCEDATE)()
        .then(res => {
          this.updateCandleStickGraph(res)
        })
    },

    updateCandleStickGraph(candles, graphDomId) {
      clearCandlestickGraph(graphDomId)
      drawCandlestickGraph(candles, graphDomId, 70, this.trends)
    },
  },
}
</script>


<style>

</style>