<template>
  <div>
    <b-table striped hover :items="tradesAnalysed" />
  </div>
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
      tradesAnalysed: []
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

      this.tradesAnalysed.push({
        index,
        date: moment(trade.date).format('DD/MM/YYYY'),
        'open date': formatDateTime(trade.date),
        'close date': formatDateTime(trade.closeDate),
        lowest: pipCalculator(trade.openRate, lowestRateInTrade),
        highest: pipCalculator(trade.openRate, highestRateInTrade),
        amount: trade.pips
      })

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