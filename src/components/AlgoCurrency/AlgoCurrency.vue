<template>
  <app-template>
    <b-row>
      <!-- header & filters -->
      <b-col>
        <p class="lead">Prototype: {{ algoId }}</p>
        <p class="lead">Currency: <b>{{ baseCurrency }}/{{ quoteCurrency }}</b></p>

        <!-- date filter -->
        <b-field class="mt-4">
          <b-datepicker placeholder="Filter date..." icon="calendar-today"
          v-model="filterDate"
          />

          <b-button class="ml-2" variant="danger" v-on:click="clearDate()">
            <i class="fas fa-times"></i>
          </b-button>
        </b-field>

        <!-- time filter -->
        <b-field class="mt-2">
          <b-timepicker placeholder="Filter time..." icon="clock"
          v-model="filterTime"
          />

          <b-button class="ml-2" variant="danger" v-on:click="clearTime()">
            <i class="fas fa-times"></i>
          </b-button>
        </b-field>

        <b-button v-on:click="uploadCurrencyTrades()">Update</b-button>
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

    <!-- Line Graph -->
    <div class="line-graph mt-5"></div>

    <ul class="list-group mt-5">
      <trade v-for="trade in trades" :key="trade.buy.id"
        :trade="trade"
      />
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
import { buildLineGraph } from '@/graph/lineGraph';
import { buildBarGraph } from '@/graph/barGraph';
import formatDataForLineGraph from '@/services/formatDataForLineGraph';
import groupOrdersIntoTrades from '@/services/groupOrdersIntoTrades';
import Trade from './children/Trade';
import pipCalculator from '@/services/pipCalculator';

let FILTER_DATE_TIME = new Date();

export default {
  components: {
    AppTemplate,
    Trade
  },

  data() {
    return {
      prototypeNo: 0,
      baseCurrency: '',
      quoteCurrency: 'USD',
      algoId: 0,
      trades: [],
      tradesUploaded: false,
      filterDate: null,
      filterTime: null,
    }
  },

  computed: {
    totalTrades() {
      return this.trades.length;
    },

    totalPips() {
      let gained = 0;
      let loss = 0;
      this.trades.forEach((trade) => {
        const pip = pipCalculator(trade.buy.rate, trade.sell.rate);
        if (pip > 0) gained += pip
        if (pip < 0) loss += pip * -1
      });

      return {gained, loss};
    },

    profitTrades() {
      return this.trades.filter((trade) =>
        pipCalculator(trade.buy.rate, trade.sell.rate) > 0
      )
    },

    lossTrades() {
      return this.trades.filter((trade) =>
        pipCalculator(trade.buy.rate, trade.sell.rate) < 0
      )
    },

    profitTradesAmount() {
      return this.profitTrades.length
    },

    avgProfitPercent() {
      return this.profitTradesPercent / this.profitTradesAmount;
    },

    avgLossPercent() {
      return this.lossTradesPercent / this.lossTradesAmount;
    },

    profitTradesPercent() {
      return this.profitTrades.reduce((acc, currentValue) => acc + currentValue.percentDiff, 0)
    },

    lossTradesPercent() {
      return this.lossTrades.reduce((acc, currentValue) => acc + currentValue.percentDiff, 0) * -1
    },

    sumPercent() {
      return this.profitTradesPercent - this.lossTradesPercent;
    },

    lossTradesAmount() {
      return this.lossTrades.length
    },

    tradesBarGraphData() {
      return [
        {
          label: 'Profit',
          value: this.profitTradesAmount,
        },
        {
          label: 'Loss',
          value: this.lossTradesAmount,
        }
      ]
    },

    avgPipsPerTradeGraph() {
      return [
        {
          label: 'Avg Profit',
          value: this.avgProfitPercent
        },
        {
          label: 'Avg Loss',
          value: this.avgLossPercent
        }
      ];
    },
  },

  beforeMount() {
    console.log('ALGO CURRENCY')
    this.algoId = this.$route.params.algoNo;
    this.baseCurrency = this.$route.params.currency;
    this.uploadCurrencyTrades();
  },

  mounted() {
    this.uploadWMAGraph()
  },

  methods: {
    uploadCurrenciesRates() {
      currenciesRatesHttpGetRequest(this.baseCurrency, 20)
        .then(res => {
          buildLineGraph(ratesForLineGraph);
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

      var diffMs = (dateA - dateB); // milliseconds between now & Christmas

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
      buildLineGraph(lineGraphData)
    },

    /**
     *
     */
    dataFormatForLineGraph(wmaDataPoints) {
      const buyValue = 1.253000000;
      const sellValue = 1.25290000;

      const details = [
        {
          key: 'rate',
          colour: 'grey',
          width: 1
        }, {
          key: 'shortWMA',
          colour: 'blue',
          width: 1
        }, {
          key: 'longWMA',
          colour: 'red',
          width: 1
        }, {
          key: 'buy',
          colour: 'rgba(0, 122, 255, 0.4)',
          width: 2
        }, {
          key: 'sell',
          colour: 'rgba(215, 46, 61, 0.4)',
          width: 2
        }
      ];

      const dataPoints = wmaDataPoints;
      dataPoints.forEach((d) => {
        d.buy = buyValue;
        d.sell = sellValue;
      });

      return {dataPoints, details}
    },

    /**
     *
     */
    uploadCurrencyTrades() {
      /* only pass datetime filter if date filter has been populated */
      const dateTimeFilter = this.filterDate ? FILTER_DATE_TIME : null;

      getCurrencyTradesHttpRequest(this.algoId, this.baseCurrency, dateTimeFilter)
        .then(res => {
          this.trades = groupOrdersIntoTrades(res);
        })
        .catch(() => {
          throw new Error('Getting currency trades');
        })
        .finally(() => {
          this.tradesUploaded = true;
        })
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
    profitTradeAmount() {
      buildBarGraph(this.tradesBarGraphData, 'trades');
    },

    lossTradesAmount() {
      buildBarGraph(this.tradesBarGraphData, 'trades')
    },

    avgProfitPercent() {
      buildBarGraph(this.avgPipsPerTradeGraph, 'avg-per-trade')
    },


    /**
     *
     */
    filterDate() {
      const d = new Date(this.filterDate);

      const year = d.getUTCFullYear();
      const month = d.getMonth();
      const day = d.getDate();

      FILTER_DATE_TIME.setFullYear(year);
      FILTER_DATE_TIME.setMonth(month);
      FILTER_DATE_TIME.setDate(day);
    },

    /**
     *
     */
    filterTime() {
      const d = new Date(this.filterTime);

      const hours = d.getHours();
      const mins = d.getMinutes();

      FILTER_DATE_TIME.setHours(hours);
      FILTER_DATE_TIME.setMinutes(mins)
    }
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
