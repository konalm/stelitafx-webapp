<template>
  <app-template>
    <b-row>
      <b-col>
        <p class="lead">Prototype: {{ protoNo }} </p>
        <p class="lead">Currency: {{ currency }} </p>
      </b-col>
    </b-row>

    <b-row class="mt-4">
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
        </b-card>
      </b-col>

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
      trade: {},
      wmaData: []
    }
  },

  beforeMount() {
    console.log('algo currency trade !!')
    this.uploadTrade();
  },

  mounted() {
    this.uploadWMAData();
  },

  computed: {
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
          colour: 'rgba(0, 122, 255, 0.4)',
          width: 3,
        }, {
          key: 'closeRate',
          colour: 'rgba(215, 46, 61, 0.4)',
          width: 3,
        }
        // {
        //   key: 'fiveWMA',
        //   colour: 'blue',
        //   width: 1
        // }, {
        //   key: 'twelveWMA',
        //   colour: 'red',
        //   width: 1
        // }, {
        //   key: 'fifteenWMA',
        //   colour: 'orange',
        //   width: 1
        // }, {
        //   key: 'thirtySixWMA',
        //   colour: 'purple',
        //   width: 1
        // }
      ];

      const protoNo = parseInt(this.protoNo);

      if (protoNo === 1 || protoNo === 2 || protoNo === 3) {
        details = details.concat(this.wmaDetailsForProtoOneAndTwo)
      }

      return { dataPoints, details };
    },

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
    }

  },

  methods: {
    uploadWMAData() {
      const path = `wma/${this.currency}/trade/${this.tradeId}`;
      getHttpRequest(path)
        .then(res => {
          this.wmaData = res;
        })
        .catch(err => {
          throw new Error('uploading WMA data for Alog currency trade');
        })
    },

    /**
     *
     */
    uploadTrade() {
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
    formattedDataForLineGraph(value) {
      buildLineGraph(value);
    }
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
