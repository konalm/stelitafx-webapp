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
            <date-filter />
          </b-col>

          <b-col col lg="5">
            <b-form-select v-model="timeInterval" :options="timeIntervalOptions" />
          </b-col>
        </b-row>
      </b-col>

      <b-col class="pl-5">
        <b-card>
          <p>Total trades {{ amountOfTrades }}</p>

          <!-- <p class="small"> -->
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
          :trades="currencyTrades[currency]"
          :currency="currency"
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
          <div v-bind:id="'pieGraph' + protoNo" class="my-3 text-center"></div>
        </b-col>
      </b-row>
    </b-card>
  </app-template>
</template>


<script>
import AppTemplate from '@/components/patterns/AppTemplate';
import { getHttpRequest } from '@/http/apiRequestV2';
import { buildBarGraph, clearBarGraph } from '@/graph/barGraph';
import { buildPieGraph, clearPieGraph } from '@/graph/pieGraph';
import ProtoCurrency from './children/ProtoCurrency.vue';
import moment from 'moment';
import DateFilter from '@/components/patterns/DateFilter.vue'
import { mapActions } from 'vuex'

export default {
  components: {
    AppTemplate,
    ProtoCurrency,
    DateFilter
  },

  data() {
    return {
      proto: {
        prototypeNo: '',
        dateCreated: '',
        description: '',
      },
      trades: [],
      filterDate: null,
      timeInterval: 1
    }
  },

  computed: {
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

    currencies() {
      return Object.keys(this.currencyTrades)
    },

    timeIntervalOptions() {
      return this.$store.getters['timeInterval/selectOptions']
    },

    protoNo() {
      return this.$route.params.id
    },

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
    this.uploadProto()
    this.uploadTrades()

    if (!this.timeIntervalOptions.length) {
      this.$store.dispatch('timeInterval/uploadTimeIntervals')
    }
  },

  methods: {
    ...mapActions({
      uploadTrades: 'trades/uploadProtoTrades'
    }),

    objectKey(object) {
      return Object.keys(object)
    },

    uploadTrades() {
      let path = `/protos/${this.protoNo}/intervals/${this.timeInterval}/trades`
      
      const dateFilter = this.$store.getters['dateFilter/filterDate'];
      if (dateFilter) path += `?date=${dateFilter}`

      getHttpRequest(path)
        .then(res => {
          this.trades = res
        })
    },

    uploadProto() {
      const path = `protos/${this.$route.params.id}`
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
  },

  watch: {
    timeInterval() {
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

    tradeStats(value) {
      clearPieGraph(this.protoNo)
      buildPieGraph(this.protoNo, value.totalPipsGained, value.totalPipsLoss)
    }
  }
}
</script>
