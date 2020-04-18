<template>
  <b-card>
    <b-row>
      <b-col>
        <p><small>trades {{ tradeAmount }}</small></p>
        <!-- <p><small>winning trades {{ winningTrades }}</small></p> -->
        <!-- <p><small>avg gain per win {{ avgGainPerWin }}</small></p> -->
        <!-- <p><small>losing trade {{ losingTrades }} </small></p> -->
        <!-- <p><small>avg loss per trade {{ avgLossPerLosing }}</small></p> -->
      </b-col>

      <b-col>
        <p><small> trades </small></p>
        <trade-performance-graph :protoNo="0" :performance="trades" 
          domClass="master-algo-trades" 
        />
      </b-col>

      <b-col>
        <p><small> avg </small></p>
        <trade-performance-graph :protoNo="0" :performance="avg" 
          domClass="master-algo-avg"
        />
      </b-col>

      <b-col>
        <pips-performance-graph :protoNo="0" :performance="pips" />
      </b-col>
    </b-row>
  </b-card>
</template>


<script>
import TradePerformanceGraph from '@/components/MasterAlgo/AlgoStats/TradePerformanceGraph';
import PipsPerformanceGraph from '@/components/MasterAlgo/AlgoStats/PipsPerformanceGraph';


export default {
  components: {
    TradePerformanceGraph,
    PipsPerformanceGraph
  },

  props: {
    masterAlgoUUID: {
      type: String,
      required: true,
    }
  },

  computed: {
    stats() {
      return this.$store.getters['algorithm/masterAlgoStats'](this.masterAlgoUUID)
    },

    tradeAmount() {
      return this.stats.reduce((sum, x) => sum + x.performance.tradeAmount, 0)
    },

    trades() {
      const winning = this.stats.reduce(
        (winningTrades, x) => winningTrades + x.performance.trades.winning, 0
      )
      const losing = this.stats.reduce((losingTrades, x) => 
        losingTrades + x.performance.trades.losing, 0
      )

      return { winning, losing }
    },

    winningTrades() {
      return this.stats.reduce((winningTrades, x) => 
        winningTrades + x.performance.trades.winning, 0
      )
    },

    losingTrades() {
      return this.stats.reduce((losingTrades, x) => 
        losingTrades + x.performance.trades.losing, 0
      )
    },

    avg() {
      return {
        winning: this.avgGainPerWin,
        losing: this.avgLossPerLosing
      }
    },

    avgGainPerWin() {
      const total = this.stats.reduce((avgSum, x) => 
        avgSum + x.performance.avg.winning, 0
      )
      return total / this.stats.length
    },

    avgLossPerLosing() {
      const total = this.stats.reduce((avgLoss, x) => 
        avgLoss + x.performance.avg.losing, 0
      )
      return total / this.stats.length
    },

    pips() {
      if (!this.stats) return {}

      return {
        winning: this.stats.reduce((pips, x) => pips + x.performance.pips.winning, 0),
        losing: this.stats.reduce((pips, x) => pips + x.performance.pips.losing, 0)
      }
    }
  }
}
</script>
