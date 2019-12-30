<template>
  <div>
   <b-table striped :items="tradesAnalysed" />
  </div>
</template>


<script>
import pipCalculator from '@/services/pipCalculator'
import { secondsBetweenDates } from '@/services/utils'

export default {
  props: {
    trades: {
      type: Array,
      required: true
    }
  },

  computed: {
    tradesAnalysed() {
      const trades = []
      this.trades.forEach((x) => {
        console.log(x.openTradeTransactionJson)

        const oandaOpenTransaction = x.openTradeTransactionJson
          ? JSON.parse(x.openTradeTransactionJson)
          : ''
        const openBidPrice = oandaOpenTransaction.fullPrice 
          ? oandaOpenTransaction.fullPrice.closeoutBid 
          : null
        const buyPriceDiff = openBidPrice ? pipCalculator(x.openRate, openBidPrice) : null

        const oandaCloseTransaction = x.closeTradeTransactionJson
          ? JSON.parse(x.closeTradeTransactionJson)
          : null
        const closeBidPrice = oandaCloseTransaction
          ? oandaCloseTransaction.price
          : null
        const closePriceDiff = closeBidPrice ? pipCalculator(x.closeRate, closeBidPrice) : null

        console.log('oanda close transaction >>')
        console.log(oandaCloseTransaction)

        trades.push({
          bidAskSpread: x.oandaBidAskSpread,
          buyPriceDiff: buyPriceDiff,
          buyTimeDiff: secondsBetweenDates(x.date, oandaOpenTransaction.time),
          closePriceDiff: closePriceDiff,
          closeTimeDiff: secondsBetweenDates(x.closeDate, oandaCloseTransaction.time)
        })
      })

      return trades
    }
  },

  data() {
    return {
      items: [
        { bidAskSpread: 1, buyPriceDiff: 1, buyTimeDiff: 3.00, sellPriceDiff: 1, sellTimeDiff: 3.00 },
        { bidAskSpread: 1, buyPriceDiff: 1, buyTimeDiff: 3.00, sellPriceDiff: 1, sellTimeDiff: 3.00 },
        { bidAskSpread: 1, buyPriceDiff: 1, buyTimeDiff: 3.00, sellPriceDiff: 1, sellTimeDiff: 3.00 },
        { bidAskSpread: 1, buyPriceDiff: 1, buyTimeDiff: 3.00, sellPriceDiff: 1, sellTimeDiff: 3.00 },
        { bidAskSpread: 1, buyPriceDiff: 1, buyTimeDiff: 3.00, sellPriceDiff: 1, sellTimeDiff: 3.00 },
        { bidAskSpread: 1, buyPriceDiff: 1, buyTimeDiff: 3.00, sellPriceDiff: 1, sellTimeDiff: 3.00 },
      ]
    }
  }
}
</script>

