<template>
  <app-template>
    <b-row>
      <b-col>
        <p class="lead">Prototype: {{ protoNo }} </p>
        <p class="lead">Currency: {{ currency }} </p>
      </b-col>
    </b-row>

    <b-row class="mt-4">
      <!-- buy -->
      <b-col>
        <b-card class="buy">
          <p>
            <b>
              {{ formatDate(buyTrade.date) }}
              <span class="ml-2">{{ formatTime(buyTrade.date) }}</span>
            </b>
          </p>

          <p class="lead">
            <i class="fas fa-arrow-up"></i>
            {{ buyTrade.rate }}
          </p>
        </b-card>
      </b-col>

      <!-- sell -->
      <b-col>
        <b-card class="sell">
          <p>
            <b>
              {{ formatDate(sellTrade.date) }}
              <span class="ml-2">{{ formatTime(sellTrade.date) }}</span>
            </b>
          </p>

          <p class="lead">
            <i class="fas fa-arrow-down"></i>
            {{ sellTrade.rate }}
          </p>
        </b-card>
      </b-col>

      <b-col>
        <b-card class="summary">
          <p v-bind:class="{
            'text-success': tradePercentDiff > 0,
            'text-danger': tradePercentDiff < 0
            }">
              % {{ tradePercentDiff }}
            </p>

          <p> Duration: {{ minsBetween }} mins </p>
        </b-card>
      </b-col>
    </b-row>

    <!-- Line Graph -->
    <b-row class="my-4">
      <b-col>
        <div class="line-graph"></div>
      </b-col>
    </b-row>
  </app-template>
</template>


<script>
import moment from 'moment';
import AppTemplate from '@/components/patterns/AppTemplate';
import { getHttpRequest } from '@/http/apiRequestV2';
import { buildLineGraph } from '@/graph/lineGraph';

export default {
  components: {
    AppTemplate
  },

  data() {
    return {
      buyTrade: {},
      sellTrade: {}
    }
  },

  beforeMount() {
    this.uploadTradeTransactions();
  },

  mounted() {
    this.buildLineGraph();
  },

  computed: {
    tradePercentDiff() {
      const diff = this.buyTrade.rate - this.sellTrade.rate;
      return (diff / this.buyTrade.rate * 100) * -1;
    },

    /**
     * minutes between the buy and sell order
     */
    minsBetween() {
      const buyDate = new Date(this.buyTrade.date);
      const sellDate = new Date(this.sellTrade.date);

      var diffMs = (sellDate - buyDate); // milliseconds between now & Christmas

      return Math.round(((diffMs % 86400000) % 3600000) / 60000); // minutes
    },

    protoNo() {
      return this.$route.params.algoNo
    },

    currency() {
      return this.$route.params.currency
    },

    buyId() {
      return this.$route.params.buyTradeId;
    },

    sellId() {
      return this.$route.params.sellTradeId;
    }
  },

  methods: {
    /**
     *
     */
     async buildLineGraph() {
       const wmaData = await this.getWMADataForGraph();
       const formattedData = this.formattedDataForLineGraph(wmaData);

       buildLineGraph(formattedData);
     },

     /**
     *
     */
     formattedDataForLineGraph(wmaData) {
       const details = [
         {
           key: 'rate',
           colour: 'grey',
           width: 1
         },
         {
           key: 'shortWMA',
           colour: 'blue',
           width: 1
         },
         {
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

       const dataPoints = wmaData;
       dataPoints.forEach((d) => {
         d.buy = this.buyTrade.rate;
         d.sell = this.sellTrade.rate;
       })

       return { details, dataPoints };
     },

    /**
     *
     */
    async getWMADataForGraph() {
      const path = `wma/${this.currency}/buy/${this.buyId}/sell/${this.sellId}`;
      return await getHttpRequest(path);
    },

    /**
     *
     */
    uploadTradeTransactions() {
      this.getTrade(this.buyId)
        .then(res => {
          this.buyTrade = res;
        });

      this.getTrade(this.sellId)
        .then(res => {
          this.sellTrade = res;
        })
    },

    /**
     *
     */
    async getTrade(id) {
      const path = `algo/${this.protoNo}/currency/${this.currency}/trade/${id}`
      return await getHttpRequest(path);
    },

    formatDate(date) {
      return moment(date).format('DD/MM/YYYY')
    },

    formatTime(date) {
      return moment(date).format('HH:mm')
    },
  }
}
</script>

<style lang="scss">
.buy {
  background: rgba(0,122,255,0.6);
}

.sell {
  background: rgba(215,46,61,0.6);
}
</style>
