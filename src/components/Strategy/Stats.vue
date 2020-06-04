<template>
  <div>
    <b-card>
      <b-row>
        <b-col>
          <p><small>trades {{ stats.tradeAmount }}</small></p>
          <p><small>Gained {{ stats.pips.winning }}</small></p>
          <p><small>Lost {{ stats.pips.losing }}</small></p>
          <p><small>{{ stats.pips.total }}</small></p>
        </b-col>

        <b-col>
          <p><small> trades </small></p>
          <trade-performance-graph :protoNo="0" :performance="stats.trades" 
            domClass="stategy-trades" 
          />
        </b-col>

        <b-col>
          <p><small> avg </small></p>
          <trade-performance-graph :protoNo="0" :performance="stats.avg" 
            domClass="strategy-avg"
          />
        </b-col>

        <b-col>
          <pips-performance-graph :protoNo="0" :performance="stats.pips" />
          {{ pipsOverallPerformance }}
        </b-col>
      </b-row>
    </b-card>
  </div>
</template>


<script>
import TradePerformanceGraph from '@/components/MasterAlgo/AlgoStats/TradePerformanceGraph';
import PipsPerformanceGraph from '@/components/MasterAlgo/AlgoStats/PipsPerformanceGraph';
import { calcPercentangeOfGain } from '@/services/utils';


export default {
  components: {
    TradePerformanceGraph,
    PipsPerformanceGraph
  },

  props: {
    stats: {
      type: Object,
      required: true,
      default: {
        tradeAmount: 0,
        pips: {
          total: 0,
          winning: 0,
          losing: 0
        },
        trades: {
          winning: 0,
          losing: 0,
          winPercent: 0
        },
        avg: {
          total: 0,
          winning: 0,
          losing: 0
        }
      }
    },
  },

  computed: {
    pipsOverallPerformance() {
      if (!this.stats) return null
      
      return calcPercentangeOfGain(this.stats.pips.winning, this.stats.pips.losing)
    }
  },
}
</script>
