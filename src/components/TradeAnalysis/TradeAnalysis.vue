<template>
  <app-template>
    <b-row>
      <b-col col lg="2">
        <p class="lead">Prototype: {{ protoNo }} </p>
        <p class="lead">Currency: {{ currency }} </p>
        <p class="lead">Time Interval: {{ trade.timeInterval }} </p>
        <p class="lead p-2 mt-1" 
          v-bind:class="{'bg-success': trade.account === 'demo'}"
        >
          Account: {{ trade.account }}
        </p>
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

          <p> Duration: {{ duration }} </p>
        </b-card>
      </b-col>
    </b-row>

    <oanda-analysis :tradeId="tradeId" :trade="trade" v-if="algorithmIsPublished" />
    
    <!-- <b-row>
      <b-col>
        <p class="lead">Lowest from open: {{ lowestPipFromOpenTrade }}</p>
        <p class="lead">Highest from open: {{ highestPipFromOpen }}</p>

      </b-col>
    </b-row> -->

    <!-- pip movement data -->
    <!-- <b-row class="mt-5">
      <b-col>
        <div class="pip-movement__container">
          <div class="item" v-for="(pip, index) in pipMovement" :key="index">
            {{ pip.pip }}
          </div>
        </div>
      </b-col>
    </b-row> -->

    <!-- open trade stats -->
    <!-- <b-row class="mt-5">
      <b-col>
        {{ trade.openStats }}
      </b-col>
    </b-row> -->

    <line-graph :trade="trade" :wmaData="wmaData" :protoNo="protoNo"
      :tradeOpenIndex="tradeOpenIndex"
      :tradeCloseIndex="tradeCloseIndex"
    />

    <stochastic-line-graph :abbrev="currency" :tradeId="tradeId" :tradeUUID="tradeUUID"
      :prototypeNumber="protoNo"
      :interval="timeInterval"
      :tradeOpenIndex="tradeOpenIndex" 
      :tradeCloseIndex="tradeCloseIndex"
    />

    <other-trades :tradeId="tradeId" :trade="trade" :protoNo="protoNo" 
      :timeInterval="timeInterval" 
      :interval="timeInterval"
      :currency="currency" 
    />
  </app-template>
</template>


<script>
import moment from 'moment';
import AppTemplate from '@/components/patterns/AppTemplate';
import OandaAnalysis from './children/OandaAnalysis';
import { getHttpRequest } from '@/http/apiRequestV2';
import { tradeViewed } from '@/http/trade';
import { compareHourAndMin, durationOfTrade } from '@/services/utils';
import pipCalculator from '@/services/pipCalculator';
import LineGraph from './children/LineGraph';
import StochasticLineGraph from './children/StochasticLineGraph';
import OtherTrades from './children/OtherTrades';


export default {
  components: {
    AppTemplate,
    OandaAnalysis,
    OtherTrades,
    LineGraph,
    StochasticLineGraph
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
      isImageModalActive: true,
      trades: [],
      dateFilter: ''
    }
  },

  beforeMount() {
    this.uploadTrade();
  },

  mounted() {
    this.uploadWMAData()
  },

  computed: {
     algorithmIsPublished() {
      return this.$store.getters['algorithm/isPublished']({
        prototypeNo: this.protoNo,
        timeInterval: this.timeInterval
      })
    },

    filterDate() { return this.$store.getters['dateFilter/filterDate'] },

    timeInterval() { return this.$route.params.interval },
 
    tradePercentDiff() {
      const diff = this.trade.openRate - this.trade.closeRate;
      return (diff / this.trade.openRate * 100) * -1;
    },

    /* duration between the buy and sell order */
    duration() { return durationOfTrade(this.trade.openDate, this.trade.closeDate) },

    protoNo() { return parseInt(this.$route.params.protoNo) },

    currency() { return this.$route.params.currency; },

    tradeId() { return parseInt(this.$route.params.UUID) },

    tradeUUID() { return this.$route.params.UUID },

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
      const i =  wmaData.findIndex(compareHourAndMin, this.trade.openDate);

      return i
    },

    tradeCloseIndex() {
      const wmaData = [...this.wmaData];
      wmaData.sort((a, b) => new Date(a.date) - new Date(b.date));
      return wmaData.findIndex(compareHourAndMin, this.trade.closeDate);
    },

    rateShortWMAPipDiffOnOpen() {
      if (this.wmaData.length === 0) return;
      if (this.tradeOpenIndex < 0) return;

      const rate = this.trade.openRate;
      const tradeOpenShortWMA = this.wmaData[this.tradeOpenIndex].WMAs['12'];
      return pipCalculator(rate, tradeOpenShortWMA, `${this.currency}/USD`) * -1
    },

    rateShortWMAPipDiffOnClose() {
      if (this.wmaData.length === 0) return
      if (this.tradeCloseIndex) return

      const rate = this.trade.closeRate;
      const tradeCloseShortWMA = this.wmaData[this.tradeCloseIndex].WMAs['12'];

      return pipCalculator(rate, tradeCloseShortWMA, `${this.currency}/USD`) * -1
    },

    pipsFromOpenTrade() {
      const wmaData = [...this.wmaData];
      const betweenTradesLength = this.tradeCloseIndex - this.tradeOpenIndex;
      const wmaDataBetweenTrades =
        wmaData.splice(this.tradeOpenIndex, betweenTradesLength);

      const pipsFromOpenTrade = [];
      wmaDataBetweenTrades.forEach((dataPoint) => {
        const pip = pipCalculator(this.trade.openRate, dataPoint.rate);
        pipsFromOpenTrade.push(pip);
      });

      return pipsFromOpenTrade
    },

    lowestPipFromOpenTrade() { return Math.min(...this.pipsFromOpenTrade) },

    highestPipFromOpen() { return Math.max(...this.pipsFromOpenTrade) },
  },

  methods: {
    calculatePip(x, y) { return pipCalculator(x, y ) },

    goToPrevTrade() {
      console.log('go to prev trade')
      console.log(this.tradeUUID)

      const path = `prev-trade/${this.tradeUUID}`
      getHttpRequest(path)
        .then(res => {
          if (!res) return;
          this.redirectTrade(res.UUID);
        })
        .catch(() => {
          throw new Error('Failed to go to previous trade');
        })
    },

    goToNextTrade() {
      const path = `next-trade/${this.tradeUUID}`
      getHttpRequest(path)
        .then(res => {
          if (!res) return;
          this.redirectTrade(res.UUID);
        })
        .catch(() => {
          throw new Error('Failed to go to next trade');
        })
    },

    redirectTrade(UUID) {
      console.log('redirect trade')

      this.$router.push({
        name: 'TradeAnalysis',
        params: {
          protoNo: this.protoNo,
          interval: this.timeInterval,
          currency: this.currency,
          UUID
        }
      })
    },

    uploadWMAData() {
      this.wmaData = [];

      const path = `/wma/${this.protoNo}/interval/${this.timeInterval}/${this.currency}/trade/${this.tradeUUID}`
      getHttpRequest(path)
        .then(res => {
          this.wmaData = res;
        })
        .catch(err => {
          throw new Error(`uploading WMA data for Algo currency trade: ${err}`);
        }) 
    },

    uploadTrade() {
      this.trade = {};

      const path = `proto/${this.protoNo}/interval/${this.timeInterval}/currency/${this.currency}/trade/${this.tradeUUID}`
      getHttpRequest(path)
        .then(res => {
          this.trade = res;
          this.$store.dispatch('timeInterval/updateInterval', res.timeInterval)
        });
    },

    formatDate(date) {
      return moment(date).format('DD/MM/YYYY')
    },

    formatTime(date) {
      return moment(date).format('HH:mm')
    },

    setTradeViewed() {

      tradeViewed(this.tradeUUID)
    }
  },

  watch: {
    trade(value) {
      if (!value.viewed) this.setTradeViewed()
    },

    /* reload trade & WMA data when routed to another trade */
    '$route.params.UUID' () {
      this.uploadTrade()
      this.uploadWMAData()
      window.scrollTo(0,0)
    },
  }
}
</script>


<style lang="scss">
.oanda__container {
  border: 1px solid rgba(0,0,0,0.1);
  padding: 15px;

  .oanda__row {
    display: flex;
    justify-content: flex-end;
  }
}

.trades__container {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;

  .item {
    flex: 1;
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
