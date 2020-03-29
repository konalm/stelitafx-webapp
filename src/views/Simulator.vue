<template>
  <app-template>
    <b-container>
      <!-- filters -->
      <b-row>
        <b-col cols lg="3">
          <date-filter v-model="filteredDate" />
        </b-col>

        <b-col cols lg="3">
          <time-interval v-model="timeInterval" />
        </b-col>

        <b-col cols lg="3">
          <abbrev-filter v-model="abbrev" />
        </b-col>
      </b-row>

      <b-row class="mt-3">
        <b-col cols lg="3">
          <b-card>
            <p class="text-success"> {{ stats.gains }} </p> 
            <p class="text-danger">{{ stats.losses * -1 }} </p>
            <p> {{ stats.gains - stats.losses * -1 }} </p>
          </b-card>
        </b-col>

        <b-col>
          <simulated-trade-analysis :periods="periods" :trade="activeTrade" />
        </b-col>
      </b-row>

      <!-- simulated history -->
      <b-row class="mt-3">
        <simulated-trade-summary v-for="(trade, index) in simulatedTrades" 
          :key="trade.close.date"
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
import { beginningOfDay } from '@/services/utils';
import { getSimulatedHistory } from '@/http/simulate-history';
import SimulatedTradeSummary from '@/components/Simulator/SimulatedTradeSummary';
import SimulatedTradeAnalysis from '@/components/Simulator/TradeGraph';

export default {
  components: {
    AppTemplate,
    DateFilter,
    TimeInterval,
    AbbrevFilter,
    SimulatedTradeSummary,
    SimulatedTradeAnalysis
  },

  data() {
    return {
      filteredDate: beginningOfDay(0),
      timeInterval: 1,
      abbrev: 'GBP',
      simulatedTrades: [],
      activeTrade: {},
      periods: []
    }
  },

  computed: {
    stats() {
      let gains = 0
      let losses = 0

      this.simulatedTrades.forEach((trade) => {
        if (trade.stats.pips > 0) gains += trade.stats.pips
        if (trade.stats.pips < 0) losses += trade.stats.pips
      })

      return {
        gains,
        losses
      }
    }
  },

  beforeMount() {
    this.uploadSimulatedHistory()
  },

  methods: {
    uploadSimulatedHistory() {
      getSimulatedHistory(this.timeInterval, this.abbrev, this.filteredDate)
        .then(res => {
          this.simulatedTrades = res.trades,
          this.periods = res.data
        })
    },

    updateActiveTrade(index) {
      console.log('update active index')
      
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

<style>

</style>