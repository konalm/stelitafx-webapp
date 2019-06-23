<template>
  <app-template>
    <div class="row">
      <div class="col">
        <p class="lead">{{ abbrev }}</p>
        <p>Quote: {{ quoteCurrency }}</p>
        <p>Currency pair abbrev: {{ currencyPairAbbrev }}</p>
      </div>
    </div>

    <div class="row mt-5">
      <div class="col">
        <p>Current Rate: {{ rate }}</p>
        <p>short WMA: {{ shortWMA }} </p>
        <p>long WMA: {{ longWMA }} </p>
      </div>
    </div>

    <b-list-group class="mt-4">
      <b-list-group-item v-for="algo in algos" :key="algo.prototype_no">
        <p class="lead">prototype {{ algo.prototype_no }}</p>
        <small>{{ algo.description }}</small>

        <p class="mt-3">
          <router-link :to="{name: 'AlgoCurrency',
            params: {
              algoNo: algo.prototype_no,
              currency: abbrev
          }}">
            <b-button variant="primary">View</b-button>
          </router-link>
        </p>
      </b-list-group-item>
    </b-list-group>
  </app-template>
</template>


<script>
import AppTemplate from '@/components/patterns/AppTemplate';
import {
  currencyWMAHttpGetRequest, getCurrencyRateHttpGetRequest
} from '@/http/currencyRates';
import { algosHttpGetRequest } from '@/http/algos';


export default {
  components: {
    AppTemplate,
  },

  data() {
    return {
      abbrev: '',
      quoteCurrency: 'USD',
      rate: 0,
      shortWMA: 0,
      longWMA: 0,
      algos: []
    }
  },

  computed: {
    currencyPairAbbrev() {
      return `${this.abbrev}/${this.quoteCurrency}`
    }
  },

  beforeMount() {
    this.abbrev = this.$route.params.abbrev;

    this.uploadWMA(12)
      .then(res => {
        this.shortWMA = res.weightWMADataPoints[0].weightedMovingAverage;
      })
    this.uploadWMA(26)
      .then(res => {
        this.longWMA = res.weightWMADataPoints[0].weightedMovingAverage;
      })
    this.uploadCurrencyRate()
    this.uploadAlgos()
  },

  methods: {
    /**
     * get weight moving average for specified weight moving average length then
     * set to state
     */
    async uploadWMA(WMALength) {
      return await currencyWMAHttpGetRequest(this.abbrev, WMALength, 0);
    },

    /**
     *
     */
    async uploadCurrencyRate() {
      getCurrencyRateHttpGetRequest(this.abbrev)
        .then(res => {
          this.rate = res.rate;
        })
    },

    /**
     *
     */
    async uploadAlgos() {
      algosHttpGetRequest()
        .then(res => {
          this.algos = res;
        })
    }
  }
}
</script>
