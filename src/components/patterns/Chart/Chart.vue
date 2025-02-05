<template>
  <section>
    <b-row>
      <stochastic-line-graph :abbrev="currency" :interval="timeInterval" 
        :count="dataPointCount" 
        :currencyRateSrc="currencyRateSrc" 
        :offset="offset" 
      />
    </b-row>

    <b-row class="mt-4 d-flex justify-content-end">
      <b-col col lg="2">
        <b-card> Volatility {{ volatility }} </b-card>
      </b-col>
    </b-row>

    <b-row>
      <div v-bind:id="domClassName"></div>
      <b-spinner variant="primary" label="Spinning" v-if="loading" />
    </b-row>

    <b-row>
      {{ onePipUpRates }}
    </b-row>

    <b-row>
      <!-- WMA draw tool -->
      <b-col col lg="4">
        <wma-draw v-model="wmaData" />
      </b-col>

      <!-- Controls -->
      <b-col col lg="3">
        <b-card>
          <b-row>
            <b-col>
              Vertical lines
              <b-button-group class="ml-2">
                <b-button v-on:click="incVerticalLineTicks()"> + </b-button>
                <b-button v-on:click="decVerticalLineTicks()"> - </b-button>
              </b-button-group>
            </b-col>
          </b-row>

          <b-row class="mt-4 d-flex">
            <b-col>
              Zoom
              <b-button-group class="ml-2">
                <b-button variant="secondary" 
                  v-on:click="updateDataPointCount('decrement')"
                >
                  +
                </b-button> 

                <b-button variant="secondary"
                  v-on:click="updateDataPointCount('increment')"
                > 
                  -
                </b-button>
              </b-button-group>
            </b-col>

            <b-col>
              <b-button-group>
                <b-button variant="secondary" v-on:click="updateOffset('increment')">
                  <i class="fas fa-chevron-left"></i>
                </b-button>

                <b-button variant="secondary" v-on:click="updateOffset('decrement')">
                  <i class="fas fa-chevron-right"></i>
                </b-button>
              </b-button-group>
            </b-col>
          </b-row>

          <b-row>
            <b-col>
              <b-form-select v-model="specificDate" :options="dateOptions" 
                class="slim mt-4" 
              />
            </b-col>
          </b-row>

          <b-row>
            <b-col>
              <b-form-select v-model="toDateRange" :options="toDateOptions" 
                class="slim mt-4" 
              />
            </b-col>
          </b-row>
        </b-card>
      </b-col>

      <b-col>
        <b-row>
          <lab v-model="algorithmn" />
        </b-row>

        <!-- Transactions -->
        <b-row class="mt-2">
          <b-card>
            <p class="border-bottom">Transaction Log</p>

            <ul class="mt-2">
              <li v-for="(transaction, index) in transactions" :key="index" 
                class="my-2"
              >
                {{ formatDateTime(transaction.date) }}

                <span class="p-1 text-white" v-bind:class="{
                  'bg-primary': transaction.type === 'open',
                  'bg-danger': transaction.type === 'close'
                }"> 
                  {{ transaction.type }} 
                </span>

                <span v-if="transaction.type === 'close' && index > 0" class="ml-3">
                  {{ calculatePips(transactions[index - 1].rate, transaction.rate) }}
                </span>
              </li>
            </ul>
          </b-card>
        </b-row>
      </b-col>
    </b-row>
  </section>
</template>


<script>
import { buildLineGraph, clearLineGraph } from '@/graph/lineGraph';
import { getHttpRequest } from '@/http/apiRequestV2';
import { 
  getWMADatapointsFromDate, 
  getMultiRates, 
  getXTBPricesFromDate, 
  getXTBRates,
  getVolatility
} from '@/http/currencyRates';
import { getTransactionIndices } from './service';
import { beginningOfDay, formatDateTime, hoursFromDate } from '@/services/utils';
import pipCalculator from '@/services/pipCalculator';
import WmaDraw from './child/WMADraw';
import Lab from './child/Lab';
import StochasticLineGraph from '@/components/Charting/child/StochasticLineGraph';
import { compareHourAndMin, durationOfTrade } from '@/services/utils';


export default {
  components: {
    WmaDraw,
    Lab,
    StochasticLineGraph
  },

  props: {
    currency: {
      type: String,
      required: true,
    },

    timeInterval: {
      type: Number,
      required: true
    },

    rates: {
      type: Boolean,
      required: false
    },

    currencyRateSrc: {
      type: String,
      required: false
    }
  },

  data() {
    return {
      quoteCurrency: '',
      wmaDataPoints: [],
      multiRates: [],
      loading: false,
      dataPointCount: 40,
      offset: 0,
      wmaData: [],
      xtbRates: [],
      algorithmn: {},
      specificDate: null,
      toDateRange: null,
      verticalLineTicks: 50,
      volatility: 0,
    }
  },

  beforeMount() {
    this.uploadWmaDataPoint()
    this.uploadXTBRates()
    this.uploadVolatility()
    // this.refreshWMADatapoints()

    this.algorithmn = { 
      "openTriggers": [ 
        { "indicator": "WMA", "parameters": { "shortWMA": 12, "longWMA": 36 } } 
      ], 
      "closeTriggers": [ 
        { "indicator": "WMA", "parameters": { "shortWMA": 12, "longWMA": 36 } } 
      ] 
    }

    if (this.rates) this.uploadMultiRates()
  },

  computed: {
    onePipUpRates() {
      if (!this.lineGraphData) return 

      const rates = this.lineGraphData.dataPoints
      const onePipUpRateIndices = []

      rates.forEach((x, i) => {
        if (i === 0) return
        if (pipCalculator(x.rate, rates[i - 1].rate)) onePipUpRateIndices.push(i)
      })

      return onePipUpRateIndices
    },

    bollingerBands() {
      let dataPoints = [...this.wmaDataPoints] 

      /* sort data points in order of date */ 
      dataPoints = dataPoints.sort((a, b) => new Date(a.date) - new Date(b.date))

      const length = 20
      const bollingerBands = []
      dataPoints.forEach((x, i) => {
        if (i < length) {
          const band = { 
            date: x.date, 
            bandMovingAverage: x.rate, 
            upperBand: x.rate, 
            lowerBand: x.rate 
          }
          bollingerBands.push(band)
          return
        }

        /* get the avereage of the last 20 rates to get the 20 moving average */
        const lastWMADataPointsForLength = [...this.wmaDataPoints].slice(i - length, i)
        const lastRates = lastWMADataPointsForLength.map(x => x.rate)
        const sumOfLastRates = lastRates.reduce((sum, x) => sum + x)
        const twentyMA = sumOfLastRates / length

        /* get the deviation (difference 20MA is from the relative rate) and square it */
        const squaredDeviations = []
        lastRates.forEach((x) => {
          let deviation = x > twentyMA ? x - twentyMA : twentyMA - x
          const squaredDeviation = Math.sqrt(deviation)
          squaredDeviations.push(deviation)
        })

        const sumOfSquaredDeviations = squaredDeviations.reduce((sum, x) => sum + x)

        const deviation = sumOfSquaredDeviations / 20

        const upperBand = twentyMA + (deviation * 2)
        const lowerBand = twentyMA - (deviation * 2)

        const band = {
          date: x.date,
          bandMovingAverage: twentyMA,
          upperBand,
          lowerBand
        }
        bollingerBands.push(band)
      })

      return bollingerBands
    },

    dateOptions() {
      return [
        { text: '--- Select a date --- ', value: null },
        { text: 'Today', value: beginningOfDay(0) },
        { text: 'Yesterday', value: beginningOfDay(1) },
        { text: 'Last 3 days', value: beginningOfDay(2) },
        { text: 'Past 7 days', value: beginningOfDay(6) },
        { text: 'Past 28 days', value: beginningOfDay(27) },
      ]
    },

    toDateOptions() {
      return [
        { text: '--- Select date range --- ', value: null },
        { text: '1 Hour', value: hoursFromDate(this.specificDate, 1) },
        { text: '2 Hour', value: hoursFromDate(this.specificDate, 2) },
        { text: '3 Hour', value: hoursFromDate(this.specificDate, 3) },
        { text: 'Now', value: null },
        { text: 'Today', value: beginningOfDay(0) },
        { text: 'Yesterday', value: beginningOfDay(1) },
        { text: 'Day before yesterday', value: beginningOfDay(2) },
      ]
    },

    domClassName() { return `linegraph` },

    dataPoints() {
      const wmaDataPoints = [...this.wmaDataPoints]

      return wmaDataPoints.map((x) => {
        let dataPoint = new Object();

        this.wmaData.forEach((y) => {
          if (y.show) {
            if (y.lengthAsString === 'rate') dataPoint['rate'] = x.rate
            else dataPoint[y.lengthAsString] = x.WMAs[y.length]
          }
        })

        return {
          date: x.date,
          ...dataPoint
        }
      });
    },

    lineGraphData() {
      if (!this.wmaData) return
      if (!this.wmaDataPoints || !this.wmaDataPoints.length) return

      let details
      let dataPoints

      if (!this.rates) {
        /* WMA's details */
        details = this.wmaData
          .filter(x => x.show)
          .map(x => ({
            key: x.lengthAsString,
            colour: x.colour,
            width: x.weight
          }))
        const bollingerBandDetails = [
          {
            key: 'upperBand',
            colour: '#00FFFF',
            width: 2
          },
          {
            key: 'lowerBand',
            colour: '#00FFFF',
            width: 2
          },
          {
            key: 'bandMovingAverage',
            colour: '#9b870c',
            width: 2
          }
        ]
        // const XTBDetails = [
        //   rr  {
        //       key: 'xtbBid',
        //       colour: 'purple',
        //       width: 3
        //     },
        //     {
        //        key: 'xtbAsk',
        //       colour: 'yellow',
        //       width: 3 
        //     }
        // ]
        details = details.concat(...bollingerBandDetails)
        // details = details.concat(...XTBDetails)

        dataPoints = [...this.dataPoints].map((x, i) => ({
          ...x,
          ...this.bollingerBands[i]
        }))

     
        // dataPoints.forEach((x) => {
        //   const i = this.xtbRates.findIndex(compareHourAndMin, x.date)
        //   const y = i >= 0 ? this.xtbRates[i] : this.xtbRates[0]

        //   console.log(`i .... ${i}`)
        //   console.log(y)

      
        //   x.xtbBid = y.bid
        //   x.xtbAsk = y.ask
        // })

        return {dataPoints, details}
      }

      /* multi rate details */
      details = [
        {
          key: 'oandaDemoRate' ,
          colour: 'blue',
          width: 2
        },
        {
          key: 'oandaFXAccountRate',
          colour: 'red',
          width: 2
        },
        {
          key: 'fixerioRate',
          colour: 'green',
          width: 2
        }
      ]
      dataPoints = this.multiRates

      return {dataPoints, details}
    },


    transactions() {
      const transactionIndices = this.transactionIndices

      const dataPoints = [...this.dataPoints]
      dataPoints.sort((a, b) => new Date(a.date) - new Date(b.date))

      const transactions = []
      transactionIndices.open.forEach((x) => {
        transactions.push({...dataPoints[x], type: 'open'})
      })
      transactionIndices.close.forEach((x) => {
        transactions.push({...dataPoints[x], type: 'close'})
      })

      return transactions
        .sort((a, b) => new Date(a.date) - new Date(b.date))
        .map(x => ({ 
          date: x.date, 
          rate: x.rate,
          type: x.type
        }))
    },

    transactionIndices() {
      if (!this.dataPoints) return

      return getTransactionIndices(this.dataPoints, this.algorithmn) 
    }
  },

  methods: {
    addOnePipUpRateClasses() {
      const xGridTicks = document.querySelectorAll(".x-grid .tick");
      if (!xGridTicks) return
      if (xGridTicks.length < this.tradeOpenIndex) return

      this.onePipUpRates.forEach((x) => {
        xGridTicks[x].classList.add("pip-up")
      })
    },

    uploadVolatility() {
      console.log('UPLOAD VOLATILITY')

      getVolatility(this.currency)
        .then(res => {
          console.log('volatility response .... ' + res)
          this.volatility = res
        })
    },

    incVerticalLineTicks() {
      this.verticalLineTicks += 10
    },
    decVerticalLineTicks() {
      this.verticalLineTicks -= 10
    },

    calculatePips(a, b) {
      return pipCalculator(a, b)
    },

    formatDateTime(dateTime) {
      return formatDateTime(dateTime)
    },

    addTradeTransactionClassToWMAGraph() {
       const transactionIndices = this.transactionIndices

      const xGridTicks = document.querySelectorAll(".x-grid .tick");
      if (!xGridTicks) return

      transactionIndices.open.forEach((x) => {
        if (xGridTicks.length < x) return
        xGridTicks[x].classList.add("trade-open")
      })

      transactionIndices.close.forEach((x) => {
        if (xGridTicks.length < x) return
        xGridTicks[x].classList.add("trade-close")
      })
    },

    updateOffset(direction) {
      if (direction === 'increment') this.offset += 4
      else if (direction === 'decrement') {
        if (this.offset <= 4) this.offset = 0
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
        offset: this.offset,
        currencyRateSrc: this.currencyRateSrc || ''
      }

      this.$store.dispatch('currencyRate/getCurrencyRateWmaData', payload)
        .then(res => {
          this.wmaDataPoints = res;
          console.log(res.length)
        })
        .finally(() => this.loading = false)
    },

    uploadXTBRates() {
      getXTBRates(this.currency, this.dataPointCount, this.offset)
        .then(res => {
          this.xtbRates = res
        })
    },

    uploadXTBRatesFromDate() {
      getXTBPricesFromDate(this.currency, this.specificDate, this.toDateRate)
        .then(res => {
          console.log('xtb res >>>')    
          console.log(res)
        })
    },

    uploadMultiRates() {
      this.loading = true 

      getMultiRates()
        .then(res => {
          this.multiRates = res
        })
    },

    uploadWMADataPointsFromStartDate() {
      this.loading = true

      getWMADatapointsFromDate(
        this.currency, 
        this.timeInterval, 
        this.specificDate,
        this.toDateRange
      )
        .then(res => {
          this.wmaDataPoints = res
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

      const graphWidth = window.innerWidth;
      const graphHeight = window.innerHeight / 2;
      buildLineGraph(
        this.lineGraphData, 
        this.domClassName, 
        graphWidth, 
        graphHeight, 
        this.verticalLineTicks
      )

      this.addTradeTransactionClassToWMAGraph()
    },
  },

  watch: {
    onePipUpRates() {
      this.addOnePipUpRateClasses()
    },

    specificDate() { 
      this.uploadWMADataPointsFromStartDate() 
      this.uploadXTBRates()
    },

    toDateRange() {
      if (this.specificDate) {
        this.uploadWMADataPointsFromStartDate()
        this.uploadXTBRates()
      }
    },

    verticalLineTicks() { this.updateGraph() },

    lineGraphData(value) { 
      if (!value) return 

      this.updateGraph() 
    },

    timeInterval() { this.uploadWmaDataPoint() },

    dataPointCount() { 
      this.uploadWmaDataPoint() 
      this.uploadXTBRates()
    },

    offset() { 
      this.uploadWmaDataPoint() 
      this.uploadXTBRates()
    },

    currency() { 
      this.uploadWmaDataPoint() 
      this.uploadXTBRates()
    },

    currencyRateSrc() { 
      this.uploadWmaDataPoint()
    }
  }
}
</script>


<style lang="scss" scoped>
.tick.trade-open {
  text {
    fill: rgba(0,122,255,1.0);
    font-weight: bold;
  }
  line {
    stroke: rgba(0,122,255,1.0);
  }
}

.tick.trade-open {
  text {
    fill: rgba(0,122,255,1.0);
    font-weight: bold;
  }
  line {
    stroke: rgba(0,122,255,1.0);
  }
}

.tick.trade-close {
  text {
    fill: rgba(215,46,61,1.0);
    font-weight: bold;
  }
  line {
    stroke: rgba(215,46,61,1.0);
  }
}

.tick.pip-up {
   text {
    fill: rgb(9, 255, 0);
    font-weight: bold;
  }
  line {
    stroke: rgb(9, 255, 0);
  }
}
</style>