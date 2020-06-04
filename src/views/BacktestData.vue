<template>
  <app-template>
    <div class="backtest__container">
      <p class="lead"> H2 </p>

      <b-row>
        <b-col>
          <wma-graph :periods="h2Periods" domClassName="backtestDataH2" v-if="h2Periods.length" />
        </b-col>

        <b-col>
          <gran-wma-line-graph gran="H2" :symbol="symbol" />
        </b-col>
      </b-row>

      <b-row>
        <b-col>
          <b-row>
            <p> Live data </p>
          </b-row>

          <b-row>
          </b-row>
        </b-col>
      </b-row>

      <hr />

      <p class="lead"> H1 </p>

      <b-row>
        <b-col>
          <b-row> Backtest data  </b-row>

          <b-row>
            <wma-graph :periods="h1Periods" domClassName="backtestDataH1" v-if="h1Periods.length" />
          </b-row>

          <b-row> Live data </b-row>

          <b-row>
            <gran-wma-line-graph gran="H1" :symbol="symbol" />
          </b-row>
        </b-col>
      </b-row>

      <b-row>
        <hr />
      </b-row>

      <p class="lead"> M5 </p>

      <b-row>
        <p> Backtest </p>
      </b-row>

      <b-row>
        <wma-graph :periods="periods" domClassName="backtestDataM15" v-if="periods.length" />
      </b-row>

      <b-row>
        <p> Live </p>
      </b-row>

      <b-row>
        <gran-wma-line-graph gran=5 :symbol="symbol" />
      </b-row>
    </div>
  </app-template>
</template>

<script>
import AppTemplate from '@/components/patterns/AppTemplate'
import { fetchCachedCalcPeriods, fetchLiveCalcPeriods } from '@/http/simulate-history';
import WmaGraph from '@/components/Simulator/AnalyseTrade/WmaGraph';
import GranWmaLineGraph from '@/components/Monitor/children/GranWmaLineGraph';


export default {
  components: {
    AppTemplate,
    WmaGraph,
    GranWmaLineGraph
  },

  data() {
    return {
      symbol: 'GBPCAD',
      periods: []
    }
  },

  beforeMount() {
    this.uploadPeriods()
    this.uploadLivePeriods()
  },

  computed: {
    h1Periods() {
      return this.abstractUpperPeriods('H1')
    },

    h2Periods() {
      return this.abstractUpperPeriods('H2')
    },

    h4Periods() {
      return this.abstractUpperPeriods('H4')
    },

    // h6Periods() {
    //   return this.abstractUpperPeriods('H6')
    // }
  },

  methods: {
    uploadPeriods() {
       fetchCachedCalcPeriods('2020-06-01T00:00:00.000Z', new Date(), 0, 'M5')()
        .then(res => {
          console.log('cached calc periods --->')
          console.log(res)

          console.log(res.length)
          this.periods = res
        })
    },

    uploadLivePeriods() {
      fetchLiveCalcPeriods('2020-06-01T00:00:00.000Z', new Date(), 0, 'M5')()
        .then(res => {
          console.log('live periods -->')
          console.log(res)
        })
    },

    abstractUpperPeriods(gran) {
      if (!this.periods.length) return []

      return this.periods.map((x) => ({
        date: x.upperPeriods[gran].date,
        rate: x.upperPeriods[gran].rate,
        exchange_rate: x.upperPeriods[gran].rate,
        wma: x.upperPeriods[gran].wma
      }))
    }
  }
}
</script>

<style scoped>
.backtest__container {
  border: 1px solid pink;
  width: 2000px;
}
</style>