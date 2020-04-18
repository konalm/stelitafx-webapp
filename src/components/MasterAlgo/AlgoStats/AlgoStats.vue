<template>
  <li class="list-group-item">
    <b-row>
      <b-col>
        <p class="mb-2"> {{ description }} </p>
        <p> <small> pips {{ pipsPerformance.total }} </small> </p>
        <p> <small> trades {{ tradeAmount }} </small> </p>
        <p> <small> winning trade {{ tradePerformance.winPercent }} % </small> </p>
        <p> <small>  avg pips per trade {{ avgPerformance.total }} </small> </p>
      </b-col>

      <b-col>
        <p> Trades </p>
        <trade-performance-graph :protoNo="algoId" :performance="tradePerformance" 
          domClass="trade" 
        />
      </b-col>

      <b-col>
        <p> Avg pips per trade </p>
        <trade-performance-graph :protoNo="algoId" :performance="avgPerformance"
          domClass="avg"
        />
      </b-col>

      <b-col>
        <p> Performance </p>
        <pips-performance-graph :protoNo="algoId" :performance="pipsPerformance" />
      </b-col>
    </b-row>
  </li>
</template>

<script>
import { fetchAlgoStats } from '@/http/algos'
// import { buildBarGraph, clearBarGraph } from '@/graph/barGraph';
import TradePerformanceGraph from './TradePerformanceGraph';
import PipsPerformanceGraph from './PipsPerformanceGraph';


export default {
  components: {
    TradePerformanceGraph,
    PipsPerformanceGraph
  },

  props: {
    algoId: {
      type: Number,
      required: true
    },

    masterAlgoUUID: {
      type: String,
      required: true
    }
  },

  data() {
    return {
      protoNo: 0,
      description: '',
      tradeAmount: 0,
      tradePerformance: {
        winning: 0,
        losing: 0,
        winPercent: 0
      },
      avgPerformance: {
        winning: 0,
        losing: 0
      },
      pipsPerformance: {
        winning: 0,
        losing: 0,
      },
    }
  },

  beforeMount() {
    this.uploadStats()
  },

  methods: {
    uploadStats() {
      fetchAlgoStats(this.algoId, 5)()
        .then(res => {
          this.protoNo = res.protoNo
          this.description = res.description
          this.tradeAmount = res.performance.tradeAmount
          this.tradePerformance = res.performance.trades 
          this.avgPerformance = res.performance.avg
          this.pipsPerformance = res.performance.pips

          this.$store.dispatch('algorithm/addMasterAlgoStatItem', {
            ...res,
            masterAlgoUUID: this.masterAlgoUUID
          })
        })
    }
  }
}
</script>