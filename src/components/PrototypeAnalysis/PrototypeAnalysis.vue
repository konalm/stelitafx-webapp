<template>
  <app-template>
    <!-- details -->
    <b-row>
      <b-col>
        <p class="lead">Prototype #{{ proto.prototypeNo }}</p>
        <p>{{ dateCreated }}</p>
        <p>{{ proto.description }}</p>

        <b-row class="mt-3 mb-2">
          <b-col col lg="5">
            <date-filter v-model="filteredDate" />
          </b-col>

          <b-col col lg="5">
            <time-interval v-model="timeInterval" />
          </b-col>
        </b-row>
      </b-col>

      <b-col class="pl-5">
        <b-card>
          <p>Total trades {{ amountOfTrades }}</p>

          <ul class="flex">
            <li class="ml-2" v-for="currency in currencies" :key="currency">
              <span class="small">
                {{ currency }} {{ currencyTrades[currency].length }}
              </span>
            </li>
          </ul>

          <p>Avg trades per day {{ averageTradesPerDay }}</p>
        </b-card>
      </b-col>
    </b-row>

    <!-- currencies -->
    <b-card class="mt-4">
      <b-row v-if="proto.prototypeNo">
        <proto-currency v-for="currency in currencies" :key="currency"
          :protoNo="protoNo"
          :currency="currency"
          :trades="currencyTrades[currency]"
          :timeInterval="timeInterval"
        />
      </b-row>
    </b-card>

    <!--Overall Performance -->
    <b-card class="my-4">
      <b-row>
        <b-col class="sm">
          <p>Overall Trades</p>
          <div class="bar-graph trades"></div>
        </b-col>

        <b-col class="sm">
          <p>Overall Avg pips per trade</p>
          <div class="bar-graph overall-avg-per-trade"></div>
        </b-col>

        <b-col class="sm">
          <p>Overall performance</p>
          <div class="bar-graph overall-performance"></div>
        </b-col>

        <b-col class="sm">
          <p>Gained: {{ tradeStats.totalPipsGained }} </p>
          <p>Lost: {{ tradeStats.totalPipsLoss }} </p>
          <p> {{ tradeStats.totalPipsGained -  tradeStats.totalPipsLoss  }} </p>
          <div v-bind:id="'pieGraph' + protoNo" class="my-3 text-center"></div>
        </b-col>
      </b-row>
    </b-card>

    <b-button v-on:click="showOanda = !showOanda">Oanda</b-button>

    <!-- Oanda Overall Performance -->
    <b-row class="my-4" v-if="algorithmIsPublished && showOanda">
      <b-col>
        <b-card>
          <p class="lead mb-3">Oanda</p>

          <p>gained {{ oandaTradeStats.totalPipsGained }}</p>
          <p>lost  {{ oandaTradeStats.totalPipsLost }}</p>
          <p> {{ oandaMargin }}</p>
          <p> total spread cost {{ oandaTradeStats.totalBidAskSpread }} </p>
          <p> average spread cost {{ oandaTradeStats.avgBidAskSpread }} </p>
          <p> {{ oandaMargin + oandaTradeStats.totalBidAskSpread  }} </p>

          <div id="pieGraphOandaOverallPerformance" class="mt-4"></div>
        </b-card>
      </b-col>

      <b-col>
        <b-card>
          <oanda-analysis :trades="trades" />
        </b-card>
      </b-col>
    </b-row>

    <trade-analysis :trades="trades" :prototypeNo="protoNo"  :interval="timeInterval" 
      :filteredDate="filteredDate"
    />

    <timezone-analysis :trades="trades" />

    <b-spinner variant="primary" label="Spinning" v-if="loading" />
  </app-template>
</template>


<script>
import AppTemplate from '@/components/patterns/AppTemplate';
import { getHttpRequest } from '@/http/apiRequestV2';
import { buildBarGraph, clearBarGraph } from '@/graph/barGraph';
import { buildPieGraph, clearPieGraph } from '@/graph/pieGraph';
import ProtoCurrency from './children/ProtoCurrencyItem.vue';
import OandaAnalysis from './children/OandaAnalysis.vue'
import moment from 'moment';
import DateFilter from '@/components/patterns/DateFilter.vue'
import TimeInterval from '@/components/patterns/TimeInterval'
import { mapGetters, mapActions } from 'vuex'
import { beginningOfDay } from '@/services/utils';
import TradeAnalysis from './children/TradeAnalysis'
import TimezoneAnalysis from './children/TimezoneAnalysis';

export default {
  components: {
    AppTemplate,
    ProtoCurrency,
    OandaAnalysis,
    DateFilter,
    TimeInterval,
    TradeAnalysis,
    TimezoneAnalysis
  },

  data() {
    return {
      proto: {
        prototypeNo: '',
        dateCreated: '',
        description: '',
      },
      trades: [],
      filteredDate: beginningOfDay(0),
      timeInterval: 1,
      loading: false,
      showOanda: false,
      viewTradeAnalysis: true
    }
  },

  computed: {
    ...mapGetters({
      dateFilter: 'dateFilter/filterDate'
    }),

    algorithmIsPublished() {
      return this.$store.getters['algorithm/isPublished']({
        prototypeNo: this.proto.prototypeNo,
        timeInterval: this.timeInterval
      })
    },

    currencyTrades() {
      const currencyTrades = {
        GBP: [],
        EUR: [],
        JPY: [],
        AUD: []
      };
      const currencies = Object.keys(currencyTrades);

      currencies.forEach((currency) => {
        currencyTrades[currency] = this.trades.filter((trade) => 
          trade.abbrev === `${currency}/USD`
        )
      })

      return currencyTrades
    },

    currencies() { return Object.keys(this.currencyTrades) },

    protoNo() { return parseInt(this.$route.params.no) },

    tradeStats() {
      let profitTrades = 0;
      let lossTrades = 0;
      let totalPipsGained = 0;
      let totalPipsLoss = 0;

      this.trades.forEach((trade) => {
        const pip = trade.pips;

        if (pip > 0) {
          profitTrades ++;
          totalPipsGained += pip;
        }

        if (pip < 0) {
          lossTrades ++;
          totalPipsLoss += pip * -1;
        }
      });

      return {
        gained: profitTrades,
        loss: lossTrades,
        totalPipsGained,
        totalPipsLoss,
        avgPipsGainedPerTrade: totalPipsGained / profitTrades,
        avgPipsLossPerTrade: totalPipsLoss / lossTrades
      };
    },

    oandaTradeStats() {
      let totalPipsGained = 0
      let totalPipsLost = 0
      let totalBidAskSpread = 0

      this.trades.forEach((t) => {
        const pips = t.oandaPips
        totalBidAskSpread += t.oandaBidAskSpread

        if (pips > 0) totalPipsGained += pips
        if (pips < 0) totalPipsLost += pips * -1
      })

      return {
        totalPipsGained,
        totalPipsLost,
        totalBidAskSpread,
        avgBidAskSpread: (totalBidAskSpread / this.trades.length).toFixed(3)
      }
    },

    oandaMargin() {
      return this.oandaTradeStats.totalPipsGained -  this.oandaTradeStats.totalPipsLost 
    },

    allTradesGraphData() {
      return [
        {
          label: 'Profit',
          value: this.tradeStats.gained
        },
        {
          label: 'Loss',
          value: this.tradeStats.loss
        }
      ];
    },

    overallAvgPipsPerTradeData() {
      return [
        {
          label: 'Profit',
          value: this.tradeStats.avgPipsGainedPerTrade
        },
        {
          label: 'Loss',
          value: this.tradeStats.avgPipsLossPerTrade
        }
      ];
    },

    overallTradePerformanceData() {
      return [
        {
          label: 'Profit',
          value: this.tradeStats.totalPipsGained,
        },
        {
          label: 'Loss',
          value: this.tradeStats.totalPipsLoss
        }
      ]
    },

    amountOfTrades() {
      return this.trades.length

      if (!this.trades || this.trades.length === 0) return;

      let totalTrades = 0;
      for (let [key, value] of Object.entries(this.trades)) {
        totalTrades += this.trades[key].length;
      }

      return totalTrades;
    },

    averageTradesPerDay() {
      const dateProtoCreated = new Date(this.proto.dateCreated);
      const now = new Date();

      const hoursProtoActive = Math.abs(now - dateProtoCreated) / 36e5;
      const daysProtoActive = hoursProtoActive / 24;

      return (this.amountOfTrades / daysProtoActive).toFixed(0);
    },

    dateCreated() {
      return moment(this.proto.dateCreated).format('DD/MM/YYYY')
    }
  },

  beforeMount() {
    this.timeInterval = parseInt(this.$route.params.interval)
    this.uploadProto()
    this.uploadTrades()
  },

  methods: {
    objectKey(object) { return Object.keys(object) },

    uploadTrades() {
      this.loading = true

      let path = `/protos/${this.protoNo}/intervals/${this.timeInterval}/trades`
      if (this.filteredDate) path += `?date=${this.filteredDate}`
      getHttpRequest(path)
        .then(res => {
          if (!res) {
            this.trades = []
            return
          }
          this.trades = res
        })
        .finally(() => {
          this.loading = false
        })
    },

    uploadProto() {
      const path = `protos/${this.protoNo}`
      getHttpRequest(path)
        .then(res => {
          this.proto = res;
        })
    },

    uploadCurrencyTradesEvent(payload) {
      this.trades[payload.currency] = payload.trades;
    },


    buildOverallTradePerformanceGraph(overallTradePerformance) {
      const graphData = [
        {
          label: 'Profit %',
          value: overallTradePerformance.profit
        }, {
          label: 'Loss %',
          value: overallTradePerformance.loss
        }
      ];

      buildBarGraph(graphData, 'overall-performance')
    },

    buildOverallOandaPerformanceGraph(performance) {
      const graphData = [
        {
          labeL 
        }
      ]
    }
  },

  watch: {
    timeInterval(value) {
      this.$router.push({name: 'PrototypeAnalysis', params: {
        no: this.protoNo,
        interval: value}
      })
    },

    '$route'(value) {
      this.uploadTrades()
    },

    filteredDate() {
      this.uploadTrades()
    },

    allTradesGraphData(value) {
      clearBarGraph('trades');
      buildBarGraph(value, 'trades')
    },

    overallAvgPipsPerTradeData(value) {
      clearBarGraph('overall-avg-per-trade')
      buildBarGraph(value, 'overall-avg-per-trade')
    },

    overallTradePerformanceData(value) {
      clearBarGraph('overall-performance')
      buildBarGraph(value, 'overall-performance')
    },

    oandaTradeStats(value) {
      clearPieGraph('OandaOverallPerformance')
      buildPieGraph('OandaOverallPerformance', value.totalPipsGained, value.totalPipsLost)
    },

    tradeStats(value) {
      clearPieGraph(this.protoNo)
      buildPieGraph(this.protoNo, value.totalPipsGained, value.totalPipsLoss)
    }
  }
}
</script>
