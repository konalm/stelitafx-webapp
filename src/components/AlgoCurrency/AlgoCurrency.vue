<template>
  <app-template>
    <b-row>
      <!-- header & filters -->
      <b-col>
        <p class="lead">Prototype: {{ algoId }}</p>
        <p class="lead">Currency: <b>{{ baseCurrency }}/{{ quoteCurrency }}</b></p>

        <date-filter />
      </b-col>

      <!-- stats -->
      <b-col col lg="2">
        <b-card class="mt-2">
          <p> Pips gained
            <span class="text-success">{{ totalPips.gained }}</span>
          </p>

          <p> Pips loss
            <span class="text-danger">{{ totalPips.loss }}</span>
          </p>

          <p class="lead mt-4">
            <b>
              <span v-bind:class="{
                'text-success': totalPips.gained - totalPips.loss > 0,
                'text-danger': totalPips.gained - totalPips.loss < 0
              }">
                {{ totalPips.gained - totalPips.loss }}
              </span>
            </b>
          </p>
        </b-card>
      </b-col>

      <!-- trades graph -->
      <b-col col lg="3">
        <b-card title="Trades">
          <b-card-text>Total {{ totalTrades }}</b-card-text>
          <div class="bar-graph trades"></div>
        </b-card>
      </b-col>

      <!-- avg per trade graph -->
      <b-col col lg="3">
        <b-card title="Avg pips Per Trade">
          <div class="bar-graph avg-per-trade"></div>
        </b-card>
      </b-col>
    </b-row>

    <ul class="nav nav-pills">
      <li class="nav-item">
        <a class="nav-link"
          v-bind:class="{active: subView === 1}"
          v-on:click="changeSubView(1)"
        >
          Graph
        </a>
      </li>

      <li>
        <a class="nav-link"
          v-bind:class="{active: subView === 2}"
          v-on:click="changeSubView(2)"
        >
          Trades
        </a>
      </li>
    </ul>

    <!-- Line Graph -->
    <div class="line-graph mt-5" v-if="subView === 1"></div>

    <ul class="list-group mt-5" v-if="subView === 2">
      <trade v-for="trade in trades" :key="trade.id" :trade="trade" />
    </ul>

    <b-alert show variant="warning" v-if="trades.length === 0 && tradesUploaded">
      No trades!
    </b-alert>
  </app-template>
</template>


<script>
import moment from 'moment';
import AppTemplate from '@/components/patterns/AppTemplate';
import { getCurrencyTradesHttpRequest } from '@/http/trade';
import {
  currenciesRatesHttpGetRequest, currenciesWMADataPointsHttpGetRequest
} from '@/http/currencyRates';
import { getHttpRequest } from '@/http/apiRequestV2';
import { buildLineGraph } from '@/graph/lineGraph';
import { buildBarGraph, clearBarGraph } from '@/graph/barGraph';
import formatDataForLineGraph from '@/services/formatDataForLineGraph';
import groupOrdersIntoTrades from '@/services/groupOrdersIntoTrades';
import Trade from './children/Trade';
import DateFilter from '@/components/patterns/DateFilter';
import { mapGetters, mapActions } from 'vuex';

let FILTER_DATE_TIME = new Date();

export default {
  components: {
    AppTemplate,
    Trade,
    DateFilter
  },

  data() {
    return {
      prototypeNo: 0,
      baseCurrency: '',
      quoteCurrency: 'USD',
      algoId: 0,
      tradesUploaded: false,
      subView: 1
    }
  },

  computed: {
    ...mapGetters({
      filterDate: 'dateFilter/filterDate'
    }),

    trades() {
      return this.$store.getters['trade/protoCurrencyTrades'](
        this.algoId,
        this.baseCurrency
      )
    },

    totalTrades() {
      return this.trades.length;
    },

    totalPips() {
      if (this.trades.length === 0) return {gained: 0, loss: 0}

      let gained = 0;
      let loss = 0;

      this.trades.forEach((trade) => {
        if (trade.pips > 0) gained += trade.pips
        if (trade.pips < 0) loss += trade.pips * -1
      });

      return {gained, loss};
    },

    profitTrades() {
      return this.trades.filter((trade) => trade.pips > 0)
    },

    lossTrades() {
      return this.trades.filter((trade) => trade.pips < 0)
    },

    tradesBarGraphData() {
      return [
        {
          label: 'Profit',
          value: this.profitTrades.length,
        },
        {
          label: 'Loss',
          value: this.lossTrades.length,
        }
      ]
    },

    avgPipsPerTradeGraph() {
      return [
        {
          label: 'Avg Profit',
          value: this.totalPips.gained / this.profitTrades.length,
        },
        {
          label: 'Avg Loss',
          value: this.totalPips.loss / this.lossTrades.length
        }
      ];
    },
  },

  beforeMount() {
    this.algoId = this.$route.params.algoNo
    this.baseCurrency = this.$route.params.currency
    this.uploadTrades({ protoNo: this.algoId, baseCurrency: this.baseCurrency })
  },

  mounted() {
    this.uploadWMAGraph()
  },

  methods: {
    ...mapActions({
      uploadTrades: 'trade/uploadProtoCurrencyTrades'
    }),

    changeSubView(viewNo) {
      this.subView = viewNo;
    },

    uploadCurrenciesRates() {
      currenciesRatesHttpGetRequest(this.baseCurrency, 100)
        .then(res => {
          buildLineGraph(ratesForLineGraph, 'line-graph', 1300, 500);
        });
    },

    clearDate() {
      this.filterDate = null;
    },

    clearTime() {
      this.filterTime = null;
    },

    calcMinsBetweenDates(dateAString, dateBString) {
      const dateA = new Date(dateAString);
      const dateB = new Date(dateBString);
      const diffMs = (dateA - dateB);

      return Math.round(((diffMs % 86400000) % 3600000) / 60000); // minutes
    },

    calcPercentDiff(originalNumber, newNumber) {
      const diff = originalNumber - newNumber;
      return (diff / originalNumber * 100) * -1;
    },

    formatDate(date) {
      return moment(date).format('DD/MM/YYYY')
    },

    formatTime(date) {
      return moment(date).format('HH:mm')
    },

    /**
     *
     */
    async uploadWMAGraph() {
      let wmaDataPoints;
      try {
        wmaDataPoints = await currenciesWMADataPointsHttpGetRequest(
                                this.baseCurrency,
                                40
                              );
      } catch (err) {
        throw new Error(err);
      }

      const lineGraphData = this.dataFormatForLineGraph(wmaDataPoints);

      buildLineGraph(lineGraphData, 'line-graph', 1300, 500)
    },

    /**
     *
     */
    dataFormatForLineGraph(wmaDataPoints) {
      const dataPoints = wmaDataPoints.map((dataPoint) => ({
        date: dataPoint.date,
        rate: dataPoint.rate,
        fiveWMA: dataPoint.WMAs["5"],
        twelveWMA: dataPoint.WMAs["12"],
        fifteenWMA: dataPoint.WMAs["15"],
        thirtySixWMA: dataPoint.WMAs["36"]
      }));

      const details = [
        {
          key: 'rate',
          colour: 'black',
          width: 1,
        }, {
          key: 'fiveWMA',
          colour: 'blue',
          width: 2
        }, {
          key: 'twelveWMA',
          colour: 'red',
          width: 2
        }, {
          key: 'fifteenWMA',
          colour: 'rgba(0, 122, 255, 0.4)',
          width: 1
        }, {
          key: 'thirtySixWMA',
          colour: 'rgba(215, 46, 61, 0.4)',
          width: 1
        }
      ];

      return {dataPoints, details}
    },

    /**
     *
     */
    tradeClass(transaction) {
      if (transaction === 'buy') return 'bg-primary'

      return 'bg-danger'
    }
  },


  watch: {
    filterDate() {
      this.uploadTrades({ protoNo: this.algoId, baseCurrency: this.baseCurrency })
    },

    subView(value) {
      if (value === 1) this.uploadWMAGraph()
    },

    tradesBarGraphData() {
      clearBarGraph('trades')
      buildBarGraph(this.tradesBarGraphData, 'trades')
    },

    avgPipsPerTradeGraph() {
      clearBarGraph('avg-per-trade');
      buildBarGraph(this.avgPipsPerTradeGraph, 'avg-per-trade')
    },
  }
}
</script>


<style lang="scss" scoped>
.list-group {
  flex-wrap: wrap;
  flex-direction: row;
  justify-content: space-between;

  .list-group-item {
    padding: 0 15px 25px;
    width: 30%;

    .header {
      background: rgb(245,245,245);
      margin-bottom: 20px;
      padding: 10px 20px;
      border: 1px rgba(0,0,0,0.1);
    }

    margin-bottom: 40px;

    .buy, .sell {
      border-radius: 12px;
    }

    .buy {
      background: rgba(0,122,255,0.6);
      margin: 0 50px;
      margin-top: 15px;
      padding: 10px 20px;
    }

    .sell {
      background: rgba(215,46,61,0.6);
      margin: 0 50px;
      padding: 10px 20px;
    }
  }
}

.line-graph {
  min-width: 1000px;
  min-height: 450px;
  border: 1px solid grey;
  padding: 10px;
  margin-bottom: 20px;
}

.bar-graph {
  padding: 10px;

  .bar {
    fill: steelblue;
    background: green;
  }
}

.bar {
  fill: steelblue;
}

.Profit {
  fill: #28a745;
}

.Loss {
  fill: #dc3545;
}
</style>
