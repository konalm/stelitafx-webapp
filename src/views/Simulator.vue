<template>
  <app-template>
    <b-container>
      <all-period-review v-if="reviewPeriods" />

      <b-row class="mt-3">
        <!-- performance summary -->
        <b-col cols lg="3">
          <performance-summary :trades="simulatedTrades" :stats="stats" />
        </b-col>

        <!-- Analyse a trade -->
        <b-col>
          <analyse-trade :trade="activeTrade" />
        </b-col>
      </b-row>

      <!-- simulated history of trades -->
      <b-row class="mt-3">
        <simulated-trade-summary v-for="(trade, index) in simulatedTrades" 
          :key="trade.close.date"
          :active="trade.open.date === activeTrade.open.date"
          :openTrade="trade.open"
          :closeTrade="trade.close"
          :stats="trade.stats"
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
import { getSimulatedHistory } from '@/http/simulate-history';
import SimulatedTradeSummary from '@/components/Simulator/SimulatedTradeSummary';
import AnalyseTrade from '@/components/Simulator/AnalyseTrade';
import { fetchCachedCalcPeriods } from '@/http/simulate-history';
import endpoints from '@/endpoints';
import { get } from '@/http/httpRequest';
import AllPeriodReview from '@/components/Simulator/AllPeriodReview'


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
    AllPeriodReview
  },

  data() {
    return {
      filteredDate: beginningOfDay(0),
      timeInterval: 1,
      abbrev: 'GBP',
      simulatedTrades: [],
      stats: {},
      activeTrade: {},
      name: '',
      reviewPeriods: false
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
      getSimulatedHistory(this.timeInterval, this.abbrev)()
        .then(res => {
          this.simulatedTrades = res.trades
          this.stats = res.stats
        })
    },

    updateActiveTrade(index) {
      this.activeTrade = this.simulatedTrades[index]
    },
  },

  watch: {
    timeInterval() {
      this.uploadSimulatedHistory()
    },
    filteredDate() {
      this.uploadSimulatedHistory()
    },
    abbrev() {
      this.uploadSimulatedHistory()
    },
    simulatedTrades(value) {
      if (!value.length) return

      this.activeTrade = value[0]
    }
  }
}
</script>
