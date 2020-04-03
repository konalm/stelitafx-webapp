<template>
  <app-template>
    <b-container>
      <b-row class="mt-3">
        <b-col cols lg="3">
          <performance-summary :trades="simulatedTrades" />
        </b-col>

        <b-col>
          <!-- <simulated-trade-analysis :periods="periods" :trade="activeTrade" /> -->
        </b-col>
      </b-row>

      <b-row>
        <line-graph :dataPoints="lineGraphRatesWma" 
          :details="lineGraphRatesWmaDetails"
          domClassName="simulator-prices-wma-line-graph" 
        />
      </b-row>

      <b-row>
        <line-graph :dataPoints="stochasticLineGraphData"
          :details="stochasticLineGraphDetails"
          domClassName="simulator-stochastic-line-graph"
        />
      </b-row>

      <b-row>
        <line-graph :dataPoints="adxLineGraphData"
          :details="adxLineGraphDetails"
          domClassName="simulator-adx-line-graph"
        />
      </b-row>

      <!-- simulated history -->
      <!-- <b-row class="mt-3">
        <simulated-trade-summary v-for="(trade, index) in simulatedTrades" 
          :key="trade.close.date"
          :openTrade="trade.open"
          :closeTrade="trade.close"
          :stats="trade.stats"
          v-on:click="updateActiveTrade(index)"
        />
      </b-row> -->
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
import SimulatedTradeAnalysis from '@/components/Simulator/TradeGraph';
import { fetchCachedCalcPeriods } from '@/http/simulate-history';
import endpoints from '@/endpoints';
import { get } from '@/http/httpRequest';

export default {
  components: {
    AppTemplate,
    DateFilter,
    TimeInterval,
    AbbrevFilter,
    SimulatedTradeSummary,
    SimulatedTradeAnalysis,
    PerformanceSummary,
    LineGraph
  },

  data() {
    return {
      filteredDate: beginningOfDay(0),
      timeInterval: 1,
      abbrev: 'GBP',
      simulatedTrades: [],
      activeTrade: {},
      periods: [],
      name: ''
    }
  },

  computed: {
    trades() {
      return this.simulatedTrades.length
    },
  },

  beforeMount() {
    // this.uploadSimulatedHistory()

    fetchCachedCalcPeriods()
      .then((res) => {
        this.periods = res.splice(res.length - 1000, res.length);
        // this.periods = res;
        this.name = 'HIGHLANDER'
      })
  },

  computed: {
    lineGraphRatesWma() {
      return [...this.periods].map((x) => ({
        date: x.date,
        rate: x.exchange_rate,
        wma5: x.wma[5],
        wma12: x.wma[12],
        wma36: x.wma[36],
        wma100: x.wma[100],
        wma200: x.wma[200]
      }))
    },

    lineGraphRatesWmaDetails() {
      return [
        {
          key: 'rate',
          colour: 'black',
          width: 1
        },
        {
          key: 'wma5',
          colour: 'orange',
          width: 1
        },
        {
          key: 'wma12',
          colour: 'green',
          width: 1
        },
        {
          key: 'wma36',
          colour: 'blue',
          width: 1
        },
        {
          key: 'wma100',
          colour: 'purple',
          width: 2
        },
        {
          key: 'wma200',
          colour: 'red',
          width: 1
        }
      ]
    },

    stochasticLineGraphData() {
      return [...this.periods].map((x) => ({
        date: x.date,
        stochastic: x.stochastic,
        twenty: 20,
        eighty: 80
      }))
    },

    stochasticLineGraphDetails() {
      return [
        {
          key: 'stochastic',
          colour: 'blue',
          width: 1
        },
        {
          key: 'twenty',
          colour: 'grey',
          width: 1
        },
        {
          key: 'eighty',
          colour: 'grey',
          width: 1
        }
      ]
    },

    adxLineGraphData() {
      return [...this.periods].map((x) => ({
        date: x.date,
        plusDi: x.adx.plusDi,
        minusDi: x.adx.minusDi,
        adx: x.adx.adx
      }))
    },

    adxLineGraphDetails() {
      return [
        {
          key: 'plusDi',
          colour: 'green',
          width: 1
        },
        {
          key: 'minusDi',
          colour: 'red',
          width: 1
        },
        {
          key: 'adx',
          colour: 'black',
          width: 1
        }
      ]
    }
  },

  methods: {
    uploadSimulatedHistory() {
      getSimulatedHistory(this.timeInterval, this.abbrev)()
        .then(res => {
          this.simulatedTrades = res.trades,
          this.periods = res.data
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
