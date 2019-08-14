<template>
  <app-template>
    <!-- details -->
    <b-row>
      <b-col>
        <p class="lead">Prototype #{{ proto.prototypeNo }}</p>
        <p>{{ dateCreated }}</p>
        <p>{{ proto.description }}</p>

        <b-row>
          <b-col col lg="5">
            <date-filter />
          </b-col>
        </b-row>
      </b-col>

      <b-col class="pl-5">
        <b-card>
          <p>Total trades {{ amountOfTrades }}</p>

          <p class="small">
            GBP {{ this.trades.GBP.length }}
            <span class="ml-2">EUR {{ this.trades.EUR.length }}</span>
            <span class="ml-2">JPY {{ this.trades.JPY.length }}</span>
            <span class="ml-2">AUD {{ this.trades.AUD.length }}</span>
          </p>

          <p>Avg trades per day {{ averageTradesPerDay }}</p>
        </b-card>
      </b-col>
    </b-row>

    <!-- currencies -->
    <b-card class="mt-4">
      <b-row v-if="proto.prototypeNo">
        <proto-currency v-for="currency in currencies"
          :protoNo="proto.prototypeNo"
          :currency="currency"
          v-on:uploadCurrencyTrades="uploadCurrencyTradesEvent"
          ref="currencyProto"
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
      </b-row>
    </b-card>
  </app-template>
</template>


<script>
import AppTemplate from '@/components/patterns/AppTemplate';
import { getHttpRequest } from '@/http/apiRequestV2';
import { buildBarGraph, clearBarGraph } from '@/graph/barGraph';
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
      currencies: ['GBP', 'EUR', 'JPY', 'AUD'],
      trades: {
        GBP: [],
        EUR: [],
        JPY: [],
        AUD: [],
      },
      filterDate: null,
    }
  },

  computed: {
    allTrades() {
      let trades = [];
      for (let [key, value] of Object.entries(this.trades)) {
        trades = trades.concat(this.trades[key]);
      }

      return trades;
    },

    tradeStats() {
      let profitTrades = 0;
      let lossTrades = 0;
      let totalPipsGained = 0;
      let totalPipsLoss = 0;

      this.allTrades.forEach((trade) => {
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
      if (this.trades.length === 0) return;

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
    this.uploadProto();
  },

  methods: {
    ...mapActions({
      uploadTrades: 'trades/uploadProtoTrades'
    }),

    uploadTrades() {
     this.$refs.currencyProto.forEach((cp) => {
       cp.uploadTradeOrders(this.filterDate);
     });
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
    }
  }
}
</script>
