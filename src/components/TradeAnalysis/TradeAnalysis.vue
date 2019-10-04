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

    <b-row> <hr /> </b-row>

    <!-- OANDA -->
    <b-container class="oanda__container">
      <b-row> 
        <b-col>
          <p class="lead">OANDA</p> 
        </b-col>
      </b-row>

      <b-row class="oanda__row mt-3">
        <!-- open -->
        <b-col>
          <b-card class="buy">
            <p> {{ oandaTradeTransactions.open.price }} 
              <u>
                <small>(Difference from stelta: 
                  {{ calculatePip(trade.openRate, oandaTradeTransactions.open.price) }})
                </small>
              </u>
            </p>
            
            <p> {{ formatDate(oandaTradeTransactions.open.time) }} 
              {{ formatTime(oandaTradeTransactions.open.time) }}
            </p>
            <!-- <p> trade opened: {{ oandaTradeTransactions.open.tradeOpened }}</p> -->
            <p class="mt-2"> bids: </p>
            <p v-for="(bid, index) in oandaTradeTransactions.open.fullPrice.bids"
              :key="index"
            >
              {{ bid.price }} 
              <u> 
                <small> (Difference from stelita: 
                  {{ calculatePip(trade.openRate, bid.price) }})
                </small>
              </u>
            </p>
          </b-card>
        </b-col>

        <!-- close -->
        <b-col>
          <b-card class="sell">
            <p> {{ oandaTradeTransactions.close.price }}
              <u>
                <small>(Difference from stelita: 
                  {{ calculatePip(trade.closeRate, oandaTradeTransactions.close.price) }})
                </small>
              </u>
            </p>
            <p>{{ formatDate(oandaTradeTransactions.close.time) }}
              {{ formatTime(oandaTradeTransactions.close.time) }}
            </p>
            <!-- <p> trade closed: {{ oandaTradeTransactions.close.tradesClosed }} </p> -->
            <p class="mt-2"> bids: </p>
            <p v-for="(bid, index) in  oandaTradeTransactions.close.fullPrice.bids"
              :key="index"
            > 
              {{ bid.price }} 
              <u><small>(Difference from stelita: 
                {{ calculatePip(trade.closeRate, bid.price) }})
                </small>
              </u>
            </p>
          </b-card>
        </b-col>

        <!-- summary -->
        <b-col>
          <b-card class="summary">
            <p> 
              {{ 
                calculatePip(
                  oandaTradeTransactions.open.price,
                  oandaTradeTransactions.close.price
                )
              }} 
            </p>

            <p> If got bid price: 
              {{ 
                calculatePip(
                  oandaTradeTransactions.open.fullPrice.bids[0].price,
                  oandaTradeTransactions.close.price
                )
              }}
            </p>
          </b-card>
        </b-col>
      </b-row>
    </b-container>
    
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

    <!-- Line Graph -->
    <b-row class="mb-3">
      <b-col>
        <div class="line-graph"></div>
      </b-col>
    </b-row>

    <b-row class="mt-3">
      <b-col col lg="2" class="mt-4">
        <date-filter />
      </b-col>

      <b-col col lg="2" class="mt-4"> {{ trade.timeInterval }} </b-col>
    </b-row>

    <b-row>
      <b-col>
        <!-- all trades here & filter -->
        <div class="trades__container">
          <trade v-for="trade in trades" :key="trade.id" :trade="trade"
            :summary="true"
            :inView="trade.id === tradeId"
            :prototypeNo="protoNo"
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
import { compareHourAndMin, durationOfTrade } from '@/services/utils';
import pipCalculator from '@/services/pipCalculator';
import DateFilter from '@/components/patterns/DateFilter';
import Trade from '@/components/PrototypeCurrencyAnalysis/children/Trade';
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
      isImageModalActive: true,
      trades: [],
      oandaTradeTransactions: {
        open: {},
        close: {}
      }
    }
  },

  beforeMount() {
    this.uploadTrade();
    this.uploadTrades();
    this.uploadOandaTradeTransactions()
  },

  mounted() {
    this.uploadWMAData();
  },

  computed: {
    filterDate() { return this.$store.getters['dateFilter/filterDate'] },

    timeInterval() { return this.$store.getters['timeInterval/interval'] },
 
    tradePercentDiff() {
      const diff = this.trade.openRate - this.trade.closeRate;
      return (diff / this.trade.openRate * 100) * -1;
    },

    /* duration between the buy and sell order */
    duration() { return durationOfTrade(this.trade.openDate, this.trade.closeDate) },

    protoNo() { return parseInt(this.$route.params.protoNo) },

    currency() { return this.$route.params.currency; },

    tradeId() { return this.$route.params.tradeId; },

    /**
     *
     */
    formattedDataForLineGraph() {
     if (!this.wmaData.length) return 
     if (!this.trade) return

      const dataPoints = this.wmaData.map((dataPoint) => ({
        date: dataPoint.date,
        rate: dataPoint.rate,
        openRate: this.trade.openRate,
        closeRate: this.trade.closeRate,
        fiveWMA: dataPoint.WMAs["5"],
        twelveWMA: dataPoint.WMAs["12"],
        fifteenWMA: dataPoint.WMAs["15"],
        thirtySixWMA: dataPoint.WMAs["36"],
        twoHundredWMA: dataPoint.WMAs["200"]
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

      if (
        protoNo === 1 || 
        protoNo === 2 || 
        protoNo === 3 || 
        protoNo === 7 ||
        protoNo === 71 ||
        protoNo === 72 ||
        protoNo === 73 ||
        protoNo === 74
      ) {
        details = details.concat(this.wmaDetailsForProtoOneAndTwo)
      }

      if (protoNo === 5 || protoNo === 51) details = details.concat(this.wmaDetails5And15)
      if (protoNo === 4 || protoNo === 6) details = details.concat(this.wmaDetails5And12)

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

    wmaDetails5And15() {
      return [
        {
          key: 'fiveWMA',
          colour: 'blue',
          width: 1
        },
        {
          key: 'fifteenWMA',
          colour: 'red',
          width: 1
        }
      ]
    },

    wmaDetails5And12() {
      return [
        {
          key: 'fiveWMA',
          colour: 'blue',
          width: 1
        },
        {
          key: 'twelveWMA',
          colour: 'red',
          width: 1
        }
      ]
    },

    wmaDetails200() {
      return [
        {
          key: 'twoHundredWMA',
          colour: 'green',
          width: 200
        }
      ]
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
      const i =  wmaData.findIndex(compareHourAndMin, this.trade.openDate);
      console.log(`trade open index --> ${i}`)
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
    calculatePip(x, y) {
      return pipCalculator(x, y );
    },

    uploadOandaTradeTransactions() {
      const path = `oanda-trade-transactions/${this.tradeId}`
      getHttpRequest(path)
        .then(res => {
          console.log('oanda trade transactions res -->')
          console.log(res)

          this.oandaTradeTransactions.open = res.openTradeTransaction
          this.oandaTradeTransactions.close = res.closeTradeTransaction
        })
        .catch (e => {
          console.error(`Failed to upload onda transactions: ${e}`)
        })
    },

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
          this.$store.dispatch('timeInterval/updateInterval', res.timeInterval)
        });
    },

    formatDate(date) {
      return moment(date).format('DD/MM/YYYY')
    },

    formatTime(date) {
      return moment(date).format('HH:mm')
    },

     async uploadTrades() {
      let path = `/protos/${this.protoNo}/intervals/${this.timeInterval}/currency/${this.currency}/trades`
      if (this.filterDate) path += `?date=${this.filterDate}`

      this.trades = await getHttpRequest(path)
    },

    addTradeOpenClassToWMAGraph() {
      if (this.tradeOpenIndex < 0) return 

      const xGridTicks = document.querySelectorAll(".x-grid .tick");
      if (!xGridTicks) return
      if (xGridTicks.length < this.tradeOpenIndex) return

      xGridTicks[this.tradeOpenIndex].classList.add("trade-open")
    },

    addTradeCloseClassToWMAGraph() {
      if (this.tradeCloseIndex < 0) return

      const xGridTicks = document.querySelectorAll(".x-grid .tick");
      if (!xGridTicks) return
      if (xGridTicks.length < this.tradeCloseIndex) return

      xGridTicks[this.tradeCloseIndex].classList.add("trade-close")
    }
  },

  watch: {
    filterDate() {
      this.uploadTrades()
    },

    formattedDataForLineGraph(value) {
      clearLineGraph('line-graph')
      buildLineGraph(value, 'line-graph', 1310, 500);
      this.addTradeOpenClassToWMAGraph()
      this.addTradeCloseClassToWMAGraph()
    },

    tradeOpenIndex() {
      this.addTradeOpenClassToWMAGraph()
    },

    tradeCloseIndex() {
     this.addTradeCloseClassToWMAGraph()
    },

    timeInterval() {
      this.uploadTrades()
    },

    trade(value) {
      // if (!value.viewed) this.setTradeToViewed(this.tradeId)
    },

    /* reload trade & WMA data when routed to another trade */
    '$route.params.tradeId' () {
      this.uploadTrade()
      this.uploadWMAData()
      window.scrollTo(0,0)
    },

    filterDate () {
      console.log('watching filter date from the store ???')
    }
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
