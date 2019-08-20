<template>
  <app-template>
    <b-row>
      <b-col col lg="2">
        <p class="lead">Prototype: {{ protoNo }} </p>
        <p class="lead">Currency: {{ currency }} </p>
      </b-col>

      <!-- nav to next trade -->
      <b-col class="nav">
        <i class="fas fa-arrow-left fa-2x" v-on:click="goToNextTrade()"></i>
        <i class="fas fa-arrow-right ml-4 fa-2x" v-on:click="goToPrevTrade()"></i>
      </b-col>

      <!-- open -->
      <b-col>
        <b-card class="buy">
          <p>
            <b>
              {{ formatDate(trade.openDate) }}
              <span class="ml-2">{{ formatTime(trade.openDate) }}</span>
            </b>
          </p>

          <p class="lead">
            <i class="fas fa-arrow-up"></i>
            {{ trade.openRate }}
          </p>

          <p>Short WMA difference
            <b class="ml-2"> {{ rateShortWMAPipDiffOnOpen }}</b>
          </p>
        </b-card>
      </b-col>

      <!-- close -->
      <b-col>
        <b-card class="sell">
          <p>
            <b>
              {{ formatDate(trade.closeDate) }}
              <span class="ml-2">{{ formatTime(trade.closeDate) }}</span>
            </b>
          </p>

          <p class="lead">
            <i class="fas fa-arrow-down"></i>
            {{ trade.closeRate }}
          </p>

          <p>Short WMA difference
            <b class="ml-2"> {{ rateShortWMAPipDiffOnClose }}</b>
          </p>
        </b-card>
      </b-col>

      <!-- summary -->
      <b-col>
        <b-card class="summary">
          <p v-bind:class="{
            'text-success': trade.pips > 0,
            'text-danger': trade.pips < 0
            }">
              {{ trade.pips }}
            </p>

          <p> Duration: {{ minsBetween }} mins </p>
        </b-card>
      </b-col>
    </b-row>

    <!-- pip movement data -->
    <b-row class="mt-5">
      <b-col>
        <div class="pip-movement__container">
          <div class="item" v-for="pip in pipMovement">
            {{ pip.pip }}
          </div>
        </div>
      </b-col>
    </b-row>

    <!-- Line Graph -->
    <b-row>
      <b-col>
        <div class="line-graph"></div>
      </b-col>
    </b-row>

    <b-row>
      <b-col col lg="2">
        <date-filter />
      </b-col>
    </b-row>

    <b-row>
      <b-col>
        <hr />
      </b-col>
    </b-row>

    <b-row>
      <b-col>
        <!-- all trades here & filter -->
        <div class="trades__container">
          <trade v-for="trade in trades" :key="trade.id" :trade="trade"
            :summary="true"
            :inView="trade.id === tradeId"
            class="item"
          />
        </div>
      </b-col>
    </b-row>
  </app-template>
</template>


<script>
import moment from 'moment';
import AppTemplate from '@/components/patterns/AppTemplate';
import { getHttpRequest } from '@/http/apiRequestV2';
import { buildLineGraph, clearLineGraph } from '@/graph/lineGraph';
import { compareHourAndMin } from '@/services/utils';
import pipCalculator from '@/services/pipCalculator';
import DateFilter from '@/components/patterns/DateFilter';
import Trade from '@/components/AlgoCurrency/children/Trade';
import { mapGetters, mapActions } from 'vuex';


export default {
  components: {
    AppTemplate,
    DateFilter,
    Trade
  },

  data() {
    return {
      trade: {
        openRate: 0.00,
        openDate: new Date(),
        closeRate: 0.00,
        closeDate: new Date(),
        viewed: false,
        pips: 0
      },

      wmaData: [],
      isImageModalActive: true
    }
  },

  beforeMount() {
    this.uploadTrade();

    if (this.trades.length === 0) {
      this.uploadTrades({ protoNo: this.protoNo, baseCurrency: this.currency })
    }
  },

  mounted() {
    this.uploadWMAData();
  },

  computed: {
    ...mapGetters({
      filterDate: 'dateFilter/filterDate'
    }),

    trades() {
      return this.$store.getters['trade/protoCurrencyTrades'](
        this.protoNo,
        this.currency
      );
    },

    tradePercentDiff() {
      const diff = this.trade.openRate - this.trade.closeRate;
      return (diff / this.trade.openRate * 100) * -1;
    },

    /**
     * minutes between the buy and sell order
     */
    minsBetween() {
      const buyDate = new Date(this.trade.openDate);
      const sellDate = new Date(this.trade.closeDate);
      var diffMs = (sellDate - buyDate);

      return Math.round(((diffMs % 86400000) % 3600000) / 60000); // minutes
    },

    protoNo() {
      return this.$route.params.algoNo
    },

    currency() {
      return this.$route.params.currency
    },

    tradeId() {
      return this.$route.params.tradeId;
    },

    /**
     *
     */
    formattedDataForLineGraph() {
      const dataPoints = this.wmaData.map((dataPoint) => ({
        date: dataPoint.date,
        rate: dataPoint.rate,
        openRate: this.trade.openRate,
        closeRate: this.trade.closeRate,
        fiveWMA: dataPoint.WMAs["5"],
        twelveWMA: dataPoint.WMAs["12"],
        fifteenWMA: dataPoint.WMAs["15"],
        thirtySixWMA: dataPoint.WMAs["36"]
      }));
      let details = [
        {
          key: 'rate',
          colour: 'black',
          width: 1,
        }, {
          key: 'openRate',
          colour: 'rgba(0, 122, 255, 1.0)',
          width: 1,
        }, {
          key: 'closeRate',
          colour: 'rgba(215, 46, 61, 1.0)',
          width: 1,
        }
      ];

      const protoNo = parseInt(this.protoNo);

      if (protoNo === 1 || protoNo === 2 || protoNo === 3 || protoNo === 7) {
        details = details.concat(this.wmaDetailsForProtoOneAndTwo)
      }

      return { dataPoints, details };
    },

    /**
     *
     */
    wmaDetailsForProtoOneAndTwo() {
      return [
        {
          key: 'twelveWMA',
          colour: 'blue',
          width: 1
        },
        {
          key: 'thirtySixWMA',
          colour: 'red',
          width: 1
        }
      ];
    },

    pipMovement() {
      const wmaData = [...this.wmaData];
      wmaData.sort((a, b) => new Date(a.date) - new Date(b.date));

      let pipDataPoints = [];
      wmaData.forEach((wmaDataItem, index) => {
        if (index === 0) return;

        const rate = wmaDataItem.rate;
        const prevRate = wmaData[index - 1].rate;
        const pip = pipCalculator(rate, prevRate, `${this.currency}/USD`) * -1
        const pipDataPoint = { date: wmaDataItem.date, pip: pip };

        pipDataPoints.push(pipDataPoint);
      });

      return pipDataPoints;
    },

    tradeOpenIndex() {
      const wmaData = [...this.wmaData];
      wmaData.sort((a, b) => new Date(a.date) - new Date(b.date));
      return wmaData.findIndex(compareHourAndMin, this.trade.openDate);
    },

    tradeCloseIndex() {
      const wmaData = [...this.wmaData];
      wmaData.sort((a, b) => new Date(a.date) - new Date(b.date));
      return wmaData.findIndex(compareHourAndMin, this.trade.closeDate);
    },

    rateShortWMAPipDiffOnOpen() {
      if (this.wmaData.length === 0) return;

      const rate = this.trade.openRate;
      const tradeOpenShortWMA = this.wmaData[this.tradeOpenIndex].WMAs['12'];
      return pipCalculator(rate, tradeOpenShortWMA, `${this.currency}/USD`) * -1
    },

    rateShortWMAPipDiffOnClose() {
      if (this.wmaData.length === 0) return;

      const rate = this.trade.closeRate;
      const tradeCloseShortWMA = this.wmaData[this.tradeCloseIndex].WMAs['12'];

      return pipCalculator(rate, tradeCloseShortWMA, `${this.currency}/USD`) * -1
    }
  },

  methods: {
    ...mapActions({
      uploadTrades: 'trade/uploadProtoCurrencyTrades',
      setTradeToViewed: 'trade/updateTradeToViewed'
    }),

    goToPrevTrade() {
      const path = `prev-trade/${this.tradeId}`
      getHttpRequest(path)
        .then(res => {
          if (!res) return;
          this.redirectTrade(res.tradeId);
        })
        .catch(() => {
          throw new Error('Failed to go to previous trade');
        })
    },

    goToNextTrade() {
      const path = `next-trade/${this.tradeId}`
      getHttpRequest(path)
        .then(res => {
          if (!res) return;
          this.redirectTrade(res.tradeId);
        })
        .catch(() => {
          throw new Error('Failed to go to next trade');
        })
    },

    redirectTrade(tradeId) {
      this.$router.push({
        name: 'AlgoCurrencyTrade',
        params: {
          algoNo: this.protoNo,
          currency: this.currency,
          tradeId
        }
      })
    },

    uploadWMAData() {
      this.wmaData = [];
      const path = `wma/${this.currency}/trade/${this.tradeId}`;
      getHttpRequest(path)
        .then(res => {
          this.wmaData = res;
        })
        .catch(err => {
          throw new Error(`uploading WMA data for Alog currency trade: ${err}`);
        })
    },

    uploadTrade() {
      this.trade = {};

      const path = `proto/${this.protoNo}/currency/${this.currency}/trade/${this.tradeId}`
      getHttpRequest(path)
        .then(res => {
          this.trade = res;
        });
    },


    formatDate(date) {
      return moment(date).format('DD/MM/YYYY')
    },

    formatTime(date) {
      return moment(date).format('HH:mm')
    },
  },

  watch: {
    filterDate() {
      this.uploadTrades({ protoNo: this.protoNo, baseCurrency: this.currency })
    },

    formattedDataForLineGraph(value) {
      clearLineGraph()
      buildLineGraph(value);
    },

    tradeOpenIndex(value) {
      if (value < 0) return;

      const xGridTicks = document.querySelectorAll(".x-grid .tick");
      xGridTicks[value].classList.add("trade-open")
    },

    tradeCloseIndex(value) {
      if (value < 0) return;
      const xGridTicks = document.querySelectorAll(".x-grid .tick");
      xGridTicks[value].classList.add("trade-close")
    },

    trade(value) {
      if (!value.viewed) this.setTradeToViewed(this.tradeId)
    },

    /* reload trade & WMA data when routed to another trade */
    '$route.params.tradeId' () {
      this.uploadTrade()
      this.uploadWMAData()
      window.scrollTo(0,0)
    }
  }
}
</script>


<style lang="scss">
.trades__container {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;

  .item {
    // margin-left: 20px;
    flex: 1;
    // width: 20%;
    min-width: 200px;
    margin: 5px 10px;
  }
}

.pip-movement__container {
  position: absolute;
  top: 0px;
  left: 20px;
  display: flex;
  justify-content: space-between;
  width: 1300px;
  padding-left: 55px;
  padding-right: 15px;
  font-size: 10px;

  .item {
    margin-left: 2px;
  }
}

.tick.trade-open {
  text {
    fill: rgba(0,122,255,1.0);
    font-weight: bold;
  }
  line {
    stroke: rgba(0,122,255,1.0);
  }
}

.tick.trade-close {
  text {
    fill: rgba(215,46,61,1.0);
    font-weight: bold;
  }
  line {
    stroke: rgba(215,46,61,1.0);
  }
}

path .line {
  fill: green;
}

.buy {
  background: rgba(0,122,255,0.6);
}

.sell {
  background: rgba(215,46,61,0.6);
}

.nav {
  .fas {
    cursor: pointer;
  }
}
</style>
