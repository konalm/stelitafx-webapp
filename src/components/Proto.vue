<template>
  <app-template>
    <!-- details -->
    <b-row>
      <b-col>
        <p class="lead">Prototype #{{ proto.prototypeNo }}</p>
        <p>{{ proto.dateCreated }}</p>
        <p>{{ proto.description }}</p>
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
      <b-row>
        <b-col>
          <p>GBP</p>
          <div class="bar-graph GBP-stats"></div>
        </b-col>

        <b-col>
          <p>EUR</p>
          <div class="bar-graph EUR-stats"></div>
        </b-col>

        <b-col>
          <p>JPY</p>
          <div class="bar-graph JPY-stats"></div>
        </b-col>

        <b-col>
          <p>AUD</p>
          <div class="bar-graph AUD-stats"></div>
        </b-col>
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
          <p>Overall Avg % per trade</p>
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
import groupOrdersIntoTrades from '@/services/groupOrdersIntoTrades';
import { buildBarGraph } from '@/graph/barGraph';


export default {
  components: {
    AppTemplate
  },

  data() {
    return {
      proto: {
        prototypeNo: '',
        dateCreated: '',
        description: '',
      },
      trades: {
        GBP: [],
        EUR: [],
        JPY: [],
        AUD: [],
      },
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

    profitTrades() {
      const trades = this.allTrades;
      return trades.filter((trade) => trade.percentDiff > 0);
    },

    lossTrades() {
      const trades = this.allTrades;
      return trades.filter((trade) => trade.percentDiff < 0);
    },

    overallTradesAmount() {
      return { profit: this.profitTrades.length, loss: this.lossTrades.length }
    },

    overallAvgTradePercent() {
      return { profit, loss}
    },

    overallTradesPercent() {
      const profit = this.profitTrades.reduce(
        (acc, currentValue) => acc + currentValue.percentDiff, 0
      );
      const loss = this.lossTrades.reduce(
        (acc, currentValue) => acc + currentValue.percentDiff, 0
      ) * -1;

      return { profit, loss }
    },

    overallTradesAvgPercent() {
      console.log('overall trades avg percent')
      console.log(this.overallTradesPercent);

      return {
        profit: this.overallTradesPercent.profit / this.overallTradesAmount.profit,
        loss: this.overallTradesPercent.loss / this.overallTradesAmount.loss
      }
    },

    allTradesGraph() {
      const graphData = [
        {
          label: 'Profit',
          value: this.profitTradesAmount
        },
        {
          label: 'Loss',
          value: this.lossTradesAmount
        }
      ];

      buildBarGraph(graphData, 'trades')
    },

    amountOfTrades() {
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
  },

  beforeMount() {
    this.uploadProto();
    this.uploadTrades();
  },

  methods: {
    uploadProto() {
      const path = `protos/${this.$route.params.id}`

      getHttpRequest(path)
        .then(res => {
          this.proto = res;
        })
    },

    /**
     *
     */
    uploadTrades() {
      const id = this.$route.params.id;
      const path = `proto/${id}/trades`

      getHttpRequest(path)
        .then(orders => {
          for (let [key, value] of Object.entries(this.trades)) {
            const abbrev = `${key}/USD`
            const currencyOrders = orders.filter((order) => {
              return order.abbrev === abbrev;
            });
            const trades = groupOrdersIntoTrades(currencyOrders);

          this.trades[key] = trades;

          const currencyTradeStats = this.currencyTradeStats(key, trades);
          const formattedDataForGraph = [
            {
              label: 'Gain',
              value: currencyTradeStats.totalProfits
            },
            {
              label: 'Loss',
              value: currencyTradeStats.totalLosses
            }
          ];

          buildBarGraph(formattedDataForGraph, `${key}-stats`)
        }
      });
    },

    currencyTradeStats(currency, trades) {
      const profitTrades = trades.filter((trade) => trade.percentDiff > 0);
      const totalProfits = profitTrades.reduce(
        (acc, currentValue) => acc + currentValue.percentDiff, 0
      );

      const lossTrades = trades.filter((trade) => trade.percentDiff < 0);
      const totalLosses = lossTrades.reduce(
        (acc, currentValue) => acc + currentValue.percentDiff, 0
      ) * -1;

      return {totalProfits, totalLosses};
    },

    buildTradesGraph(tradesAmount) {
      const graphData = [
        {
          label: 'Profit',
          value: tradesAmount.profit
        },
        {
          label: 'Loss',
          value: tradesAmount.loss
        }
      ];

      buildBarGraph(graphData, 'trades')
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

    buildOverallAvgTradeGraph(avgTradePercent) {
      console.log('build overall avg trade graph');

      const graphData = [
        {
          label: 'Profit',
          value: avgTradePercent.profit
        }, {
          label: 'Loss',
          value: avgTradePercent.loss
        }
      ];

      buildBarGraph(graphData, 'overall-avg-per-trade');
    }
  },

  watch: {
    overallTradesAmount(value) {
      this.buildTradesGraph(value);
    },

    overallTradesPercent(value) {
      this.buildOverallTradePerformanceGraph(value)
    },

    overallTradesAvgPercent(value) {
      console.log('watch >> overall trades avg');
      console.log(value);

      this.buildOverallAvgTradeGraph(value)
    }
  }
}
</script>
