<template>
  <app-template>
    <div class="row top-row">
      <div class="col-sm-3">
        <p class="lead">Prototype: {{ algoId }}</p>
        <p class="lead">Currency: <b>{{ baseCurrency }}/{{ quoteCurrency }}</b></p>

        <b-field class="mt-5">
          <b-datepicker placeholder="Filter date..." icon="calendar-today"
            v-model="filterDate"
          />

          <b-button class="ml-2" variant="danger" v-on:click="clearDate()">
            <i class="fas fa-times"></i>
          </b-button>
        </b-field>

        <b-field class="mt-1">
          <b-timepicker placeholder="Filter time..." icon="clock"
            v-model="filterTime"
          />

          <b-button class="ml-2" variant="danger" v-on:click="clearTime()">
            <i class="fas fa-times"></i>
          </b-button>
        </b-field>

        <b-button v-on:click="uploadCurrencyTrades()">Update</b-button>
      </div>

      <div class="col-md-6 ml-5">
        <!-- Trades -->
        <b-card>
          <div class="row">
            <div class="col">
              <p>Total profit %
                <span class="text-success">{{ profitTradesPercent }}</span>
              </p>
              <p>Total loss %
                <span class="text-danger">{{ lossTradesPercent }}</span>
              </p>
            </div>

            <div class="col">
              <p class="lead mt-4">
                <b>
                  <span v-bind:class="{
                    'text-success': sumPercent > 0,
                    'text-danger': sumPercent < 0
                  }">
                    {{ sumPercent }}
                  </span>
                </b>
              </p>
            </div>
          </div>
        </b-card>

        <b-row class="mt-4">
          <b-col>
            <b-card title="Trades">
              <b-card-text>Total {{ totalTrades }}</b-card-text>
              <div class="bar-graph trades"></div>
            </b-card>
          </b-col>

          <b-col>
            <b-card title="Avg % Per Trade">
              <div class="bar-graph avg-per-trade"></div>
            </b-card>
          </b-col>
        </b-row>
      </div>
    </div>

    <!-- Line Graph -->
    <div class="line-graph mt-5"></div>

    <ul class="list-group mt-5">
      <trade v-for="trade in tradesGrouped" :key="trade.buy.id"
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
      return this.tradesGrouped.length;
    },

    profitTrades() {
      return this.tradesGrouped.filter((trade) => trade.percentDiff > 0)
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

    lossTrades() {
      return this.tradesGrouped.filter((trade) => trade.percentDiff < 0)
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

    avgTradesPercentGraphData() {
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

    tradesGrouped() {
      const trades = groupOrdersIntoTrades(this.trades);

      return trades
    }
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
                                100
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
          this.trades = res;
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
      buildBarGraph(this.avgTradesPercentGraphData, 'avg-per-trade')
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


<style lang="scss">
.top-row {
  justify-content: space-between;
}

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
