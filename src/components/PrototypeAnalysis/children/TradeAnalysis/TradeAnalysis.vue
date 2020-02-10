<template>
  <div>
    <b-row>
      <b-col>
        <b-card>
          <b-row class="d-inline-flex"> 
            <p class="mr-3">Stop Loss: </p>
            <b-form-input v-model.number="stopLoss" class="w-25 mr-3" />
            <b-button v-on:click="stopLossDec()" class="mr-2"> - </b-button>
            <b-button v-on:click="stopLossInc()"> + </b-button>
            <b-form-checkbox v-model="useStopLoss" name="check-button" class="ml-4" switch />
          </b-row>

          <b-row class="mt-4">
            <p class="mr-3">Stop Gain: </p>
            <b-form-input v-model.number="stopGain" class="w-25 mr-3" />
            <b-button v-on:click="stopGainDec()" class="mr-2"> - </b-button>
            <b-button v-on:click="stopGainInc()"> + </b-button>
            <b-form-checkbox v-model="useStopGain" name="check-button" class="ml-4" switch />
          </b-row>
        </b-card>
      </b-col>

      <b-col>
        <b-card> 
          <b-row>
            <b-col>
              <p> Trades {{ trades.length }} </p>
              <hr />
            </b-col>
          </b-row>

          <b-row>
            <b-col>
              <p><b> Before </b></p>
              <p> Gained  {{ originalStats.gained }}  </p>
              <p> Lost {{ originalStats.lost }} </p>
              <p> <b> {{ twoDeci(originalStats.gained - originalStats.lost) }} </b> </p>
            </b-col>

            <b-col>
              <p><b> After </b></p>
              <p> Gained {{ implementingStopLossStats.g }} </p>
              <p> Lost {{ implementingStopLossStats.l }} </p>
              <p> Stop loss T {{ implementingStopLossStats.stopLossesTriggered }} </p>
              <p> Stop gain T {{ implementingStopLossStats.stopGainsTriggered }} </p>
              <p> <b> {{ twoDeci(implementingStopLossStats.g - implementingStopLossStats.l) }}</b> </p>
            </b-col>
          </b-row>
        </b-card>
      </b-col>
    </b-row>

    <b-row class="mt-5">
      <b-col>
        <b-spinner v-if="loading" />
        <b-table striped hover :items="tradeAnalysesFormatted" v-else />
      </b-col>
    </b-row>
  </div>
</template>


<script>
import moment from 'moment';
import TradeItemAnalysis from './children/TradeItemAnalysis.vue'
import { getWMADataForTrade, getPrototypeIntervalTradeAnalyses } from '@/http/trade'
import pipCalculator from '@/services/pipCalculator'
import { formatDateTime } from '@/services/utils'


export default {
  components: {
    TradeItemAnalysis,
  },

  props: {
    trades: { type: Array, required: true },
    prototypeNo: { required: true },
    interval: { type: Number, required: true },
    filteredDate: { type: String, required: false }
  },

  data() {
    return {
      stopLoss: 5,
      stopGain: 5,
      tradesAnalysed: [],
      loading: true,
      useStopLoss: true,
      useStopGain: false
    }
  },

  computed: {
    tradeAnalysesFormatted () {
      if (!this.tradesAnalysed) return []

      return this.tradesAnalysed.map((x) => {
        const triggeredStopLoss = x.low.pips <= this.stopLoss * -1

        return {
          abbrev: x.abbrev,
          date: moment(x.closeDate).format('DD/MM/YYYY'),
          time: moment(x.closeDate).format('HH mm'),
          lowest: x.low.pips,
          highest: x.high.pips,
          amount: triggeredStopLoss ? this.stopLoss * -1 : x.pips,
          triggeredStopLoss,
          analyseTrade: '<a href="#">click me :)</a>'
        }
      })
    },
  
    originalStats() {
      let gained = 0
      let lost = 0

      this.trades.forEach((x) => {
        const pips = x.pips
        if (pips > 0) gained += pips
        if (pips < 0) lost += pips * -1
      })

      return { gained: this.twoDeci(gained), lost: this.twoDeci(lost) }
    },

    implementingStopLossStats() {
      let g = 0
      let l = 0
      let stopLossesTriggered = 0
      let stopGainsTriggered = 0

      if (!this.tradesAnalysed) return { g, l, stopLossesTriggered, stopGainsTriggered }

      let trades = 0
      let less = 0
      let lessNotTriggered = 0

      this.tradesAnalysed.forEach((x) => {
        trades ++
        const p = x.pips
        let triggeredStopLoss = false
        let triggeredStopGain = false
      
        /* triggered stop gain */
        if (this.useStopGain && (x.high.pips >= this.stopGain)) {
          triggeredStopGain = true
        }
    
        /* triggered stop loss */
        if (this.useStopLoss && (x.low.pips <= this.stopLoss * -1)) triggeredStopLoss = true

        /* if triggered stop loss and stop gain use the one that would of been triggered
          first */
        if (triggeredStopLoss && triggeredStopGain) {
          if (new Date(x.low.date) < new Date(x.high.date)) triggeredStopGain = false
          else triggeredStopLoss = false
        }

        if (triggeredStopLoss && !triggeredStopGain) {
          l += this.stopLoss
          stopLossesTriggered ++
        }
        if (triggeredStopGain && !triggeredStopLoss) {
          g += this.stopGain
          stopGainsTriggered ++
        }

        /* no stops triggered, use the close rate */
        if (!triggeredStopLoss && !triggeredStopGain) {
          if (p > 0) g += p
          if (p < 0) l += p * -1
        }
      })

      return { g: this.twoDeci(g) , l: this.twoDeci(l), stopLossesTriggered, stopGainsTriggered }
    }
  },

  mounted() {
    this.uploadWMADataForTrade()
  },

  methods: {
    async uploadWMADataForTrade() {
      this.loading = true

      this.tradesAnalysed = await getPrototypeIntervalTradeAnalyses(
        this.prototypeNo, 
        this.interval, 
        this.filteredDate
      )

      this.loading = false

      // return 


      // const currency = trade.abbrev.substring(0,3)

      // let wmaData
      // try {
      //   wmaData = await getWMADataForTrade(this.prototypeNo, this.interval, currency, trade.uuid)
      // } catch (e) {
      //   console.error(`Failed to get WMA data for ${tradeUUID}`)
      // }

      // const lowestRateInTrade = wmaData.reduce((min, x) => x.rate < min ? x.rate : min, wmaData[0].rate)
      // const highestRateInTrade = wmaData.reduce((max, x) => x.rate > max ? x.rate : max, wmaData[0].rate)

      // const lowest = pipCalculator(trade.openRate, lowestRateInTrade) * -1
      // const triggeredStopLoss = lowest >= this.stopLoss 
      // const amount = triggeredStopLoss ? this.stopLoss * -1 : trade.pips
      
      // this.tradesAnalysed.push({
      //   index,
      //   abbrev: trade.abbrev,
      //   date: moment(trade.date).format('DD/MM/YYYY'),
      //   'open date': formatDateTime(trade.date),
      //   'close date': formatDateTime(trade.closeDate),
      //   lowest: lowest * -1,
      //   highest: pipCalculator(trade.openRate, highestRateInTrade),
      //   amount,
      //   triggeredStopLoss
      // })
    },

    twoDeci(num) {
      if (!num) return 


      const numberS = num.toFixed(2)
      return parseFloat(numberS)
    },

    stopLossDec() {
      this.stopLoss --
    },

    stopLossInc() {
      this.stopLoss ++
    },

    stopGainDec() {
      this.stopGain --
    },

    stopGainInc() {
      this.stopGain ++
    }
  },

  watch: {
    filteredDate() {
      console.log('trade analysis. watch filter date')
      this.uploadWMADataForTrade()
    },
    interval() {
      console.log('trade analysis, watch interval')
      this.uploadWMADataForTrade()
    }
  }
}
</script>

<style>

</style>