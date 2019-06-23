<template>
  <b-col>
    <b-card v-bind:title="currencyRate.abbrev">
      <b-card-text> Date: {{ currencyRate.date }} </b-card-text>
      <b-card-text> Rate: {{ currencyRate.exchange_rate }} </b-card-text>
      <b-card-text> 12 WMA: {{ shortWMA }} </b-card-text>
      <b-card-text> 26 WMA: {{ longWMA }} </b-card-text>

      <div class="row text-center align-center">
        <div class="col arrow-icons">
          <i class="fa fa-arrow-up text-success" v-if="prevWMATrend === 'up'"></i>
          <i class="fas fa-ellipsis-h text-warning" v-if="prevWMATrend === 'neutral'"></i>
          <i class="fa fa-arrow-down text-danger" v-if="prevWMATrend === 'down'"></i>
        </div>

        <div class="col arrow-icons">
          <i class="fa fa-arrow-up text-success" v-if="WMATrend === 'up'"></i>
          <i class="fas fa-ellipsis-h text-warning" v-if="WMATrend === 'neutral'"></i>
          <i class="fa fa-arrow-down text-danger" v-if="WMATrend === 'down'"></i>
        </div>
      </div>

      <div v-if="WMATrend !== prevWMATrend" class="alert alert-primary"
        role="alert"
      >
        New Trend!
      </div>

      <div class="row mt-2">
        <div class="col">
          <router-link :to="{name: 'Currency', params: { abbrev: currencyRate.base_currency }}">
              <b-button variant="primary" class="w-100">Go to currency</b-button>
          </router-link>
        </div>
      </div>

      <div class="row mt-2">
        <div class="col">
          <b-button class="w-100"> Open in Trading View </b-button>
        </div>
      </div>
    </b-card>
  </b-col>
</template>



<script>
import { currencyWMAHttpGetRequest } from '@/http/currencyRates';

const SHORT_WMA_LENGTH = 12;
const LONG_WMA_LENGTH = 26;


export default {
  props: {
    currencyRate: {
      base_currency: '',
      date: '',
      rate: '',
      twelveWMA: '',
      twentySixWMA: ''
    },
  },

  data() {
    return {
      shortWMA: 0,
      prevShortWMA: 0,
      longWMA: 0,
      prevLongWMA: 0,
    }
  },

  computed: {
    WMATrend() {
      return this.getWMATrend(this.shortWMA, this.longWMA);
    },

    prevWMATrend() {
      return this.getWMATrend(this.prevShortWMA, this.prevLongWMA);
    }
  },

  beforeMount() {
    this.uploadWMA(SHORT_WMA_LENGTH)
      .then(res => {
        this.shortWMA = res.weightWMADataPoints[1].weightedMovingAverage;
        this.prevShortWMA = res.weightWMADataPoints[0].weightedMovingAverage;
      })
    this.uploadWMA(LONG_WMA_LENGTH)
      .then(res => {
        this.longWMA = res.weightWMADataPoints[1].weightedMovingAverage;
        this.prevLongWMA = res.weightWMADataPoints[0].weightedMovingAverage;
      })
  },

  methods: {
    getWMATrend(shortWMA, longWMA) {
      if (shortWMA > longWMA) return 'up';
      if (shortWMA === longWMA) return 'neutral';
      if (shortWMA < longWMA) return 'down';
    },

    /**
     * get weight moving average for specified weight moving average length then
     * set to state
     */
    async uploadWMA(WMALength) {
      return await currencyWMAHttpGetRequest(
                     this.currencyRate.base_currency,
                     WMALength,
                     2
                   );
    }
  }
}
</script>

<style lang="scss" scoped>
.col {
  text-align: center;
}

.arrow-icons {
  font-size: 50px;
}
</style>
