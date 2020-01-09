<template>
  <b-row>
    <b-col>
      <b-table striped hover :items="tradesAnalysed" />
    </b-col>

    <b-col>
      <b-card>
        <p> Stop Loss: {{ stopLoss }} 
          <b-button v-on:click="stopLossDec()" class="mr-1"> - </b-button>
          <b-button v-on:click="stopLossInc()"> + </b-button>
        </p>

        <br />

        <p>
          Original: 
          ( G {{ originalStats.gained }}  |  L {{ originalStats.lost }} ) 
            {{ originalStats.gained - originalStats.lost }}
        </p>

        <p>
          Stop Loss: 
          ( G {{ implementingStopLossStats.g }}  |  L {{ implementingStopLossStats.l }} )  
            {{ implementingStopLossStats.g - implementingStopLossStats.l }}
            / triggered {{ implementingStopLossStats.triggered }}
        </p>
      </b-card>
    </b-col>
  </b-row>
</template>


<script>
import moment from 'moment';
import TradeItemAnalysis from './children/TradeItemAnalysis.vue'
import { getWMADataForTrade} from '@/http/trade'
import pipCalculator from '@/services/pipCalculator'
import { formatDateTime } from '@/services/utils'


export default {
  components: {
    TradeItemAnalysis,
  },

  props: {
    trades: {
      type: Array,
      required: true
    },

    prototypeNo: {
      required: true
    },

    interval: {
      type: Number,
      required: true
    },
  },

  data() {
    return {
      stopLoss: 100,
      tradesAnalysed: []
    }
  },

  computed: {
    originalStats() {
      let gained = 0
      let lost = 0

      this.trades.forEach((x) => {
        const pips = x.pips
        if (pips > 0) gained += pips
        if (pips < 0) lost += pips * -1
      })

      return { gained, lost }
    },

    implementingStopLossStats() {
      let g = 0
      let l = 0
      let triggered = 0

      this.tradesAnalysed.forEach((x) => {
        const a = x.amount
        if (a > 0) g += a
        if (a < 0) l += a * -1
        if (x.triggeredStopLoss) triggered ++
      })

      return { g, l, triggered }
    }
  },

  methods: {
    async uploadWMADataForTrade(trade, index) {
      const currency = trade.abbrev.substring(0,3)

      let wmaData
      try {
        wmaData = await getWMADataForTrade(this.prototypeNo, this.interval, currency, trade.uuid)
      } catch (e) {
        console.error(`Failed to get WMA data for ${tradeUUID}`)
      }

      const lowestRateInTrade = wmaData.reduce((min, x) => x.rate < min ? x.rate : min, wmaData[0].rate)
      const highestRateInTrade = wmaData.reduce((max, x) => x.rate > max ? x.rate : max, wmaData[0].rate)

      const lowest = pipCalculator(trade.openRate, lowestRateInTrade) * -1
      const triggeredStopLoss = lowest >= this.stopLoss 
      const amount = triggeredStopLoss ? this.stopLoss * -1 : trade.pips
      
      this.tradesAnalysed.push({
        index,
        abbrev: trade.abbrev,
        date: moment(trade.date).format('DD/MM/YYYY'),
        'open date': formatDateTime(trade.date),
        'close date': formatDateTime(trade.closeDate),
        lowest: lowest * -1,
        highest: pipCalculator(trade.openRate, highestRateInTrade),
        amount,
        triggeredStopLoss
      })
    },

    stopLossDec() {
      this.stopLoss --
    },

    stopLossInc() {
      this.stopLoss ++
    }
  },

  watch: {
    trades(trades) {
      trades.forEach(async (x, i) => {
       await this.uploadWMADataForTrade(x, i)
      })
    }
  }
}
</script>

<style>

</style>