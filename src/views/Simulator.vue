<template>
  <app-template>
    <b-container>
      <all-period-review v-if="reviewPeriods" />

      <b-row class="mt-3">
        <!-- performance summary -->
        <b-col cols lg="3">
          <performance-summary :performance="performance" />
        </b-col>

        <b-col>
          <!-- <b-row>
            <duration-period gran="H12" />
          </b-row> -->

          <!-- <b-row>
            <duration-period gran="H6" />
          </b-row> -->

          <!-- <b-row>
            <duration-period gran="H4" />
          </b-row> -->

          <b-row>
            <duration-period gran="H2" />
          </b-row>

          <b-row>
            <duration-period gran="H1" />
          </b-row>

          <b-row>
            <duration-period gran="M5" />
          </b-row>
   
          <!-- Analyse a trade -->
          <b-row>
            <analyse-trade :trade="activeTrade" />
          </b-row>
        </b-col>
      </b-row>

      <!-- simulated history of trades -->
      <b-row class="mt-3">
        <simulated-trade-summary v-for="(trade, index) in simulatedTrades" 
          :key="trade.close.date"
          :active="trade.open.date === activeTrade.open.date"
          :openTrade="trade.open"
          :closeTrade="trade.close"
          v-on:click="updateActiveTrade(index)"
        />
      </b-row>
    </b-container>
  </app-template>
</template>


<script>
import AppTemplate from '@/components/patterns/AppTemplate';
import DateFilter from '@/components/patterns/DateFilter';
import TimeInterval from '@/components/patterns/TimeInterval';
import AbbrevFilter from '@/components/patterns/AbbrevFilter';
import PerformanceSummary from '@/components/Simulator/PerformanceSummary';
import LineGraph from '@/components/patterns/LineGraph';
import { beginningOfDay } from '@/services/utils';
import { getSimulatedHistory, fetchSimulatedPerformance } from '@/http/simulate-history';
import SimulatedTradeSummary from '@/components/Simulator/SimulatedTradeSummary';
import AnalyseTrade from '@/components/Simulator/AnalyseTrade';
// import { fetchCachedCalcPeriods } from '@/http/simulate-history';
import endpoints from '@/endpoints';
import { get } from '@/http/httpRequest';
import AllPeriodReview from '@/components/Simulator/AllPeriodReview'
import DurationPeriod from '@/components/Simulator/DurationPeriod';
// import WmaGraph from '@/components/Simulator/AnalyseTrade/WmaGraph';



export default {
  components: {
    AppTemplate,
    DateFilter,
    TimeInterval,
    AbbrevFilter,
    SimulatedTradeSummary,
    AnalyseTrade,
    PerformanceSummary,
    LineGraph,
    AllPeriodReview,
    DurationPeriod
    // WmaGraph
  },

  data() {
    return {
      filteredDate: beginningOfDay(0),
      timeInterval: 1,
      abbrev: 'GBP',
      simulatedTrades: [],
      stats: {},
      performance: {},
      activeTrade: {},
      name: '',
      reviewPeriods: false,
      periods: []
    }
  },

  computed: {
    trades() {
      return this.simulatedTrades.length
    },
  },

  beforeMount() {
    this.uploadSimulatedHistory()
  },


  methods: {
    uploadSimulatedHistory() {
      fetchSimulatedPerformance()()
        .then(res => {
          console.log('fetch sim per res -->')
          console.log(res)

          this.simulatedTrades = res.trades
          this.performance = res.performance
          // this.stats = res.stats
        })
    },

    updateActiveTrade(index) {
      this.activeTrade = this.simulatedTrades[index]
    },

  },

  watch: {
    simulatedTrades(value) {
      if (!value.length) return

      this.activeTrade = value[0]
    }
  }
}
</script>
