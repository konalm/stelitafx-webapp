<template>
  <app-template>
    <div class="backtest__container">
      <b-row>
        <b-col cols="2">
          <b-form-input v-model="openDate" placeholder="open date" />
          <b-form-input v-model="closeDate" placeholder="close date" class="mt-1" />
          <b-form-input v-model.number="buffer" placeholder="buffer" class="mt-1" />
          <b-button class="mt-1" v-on:click="refocus()"> update </b-button>
        </b-col>
      </b-row>

      <b-row class="my-5">
        <b-col> Backtest </b-col>
        <b-col> Live </b-col>
      </b-row>
      
      <p class="lead"> H2 </p>

      <b-row>
        <b-col>
          <wma-graph :periods="h2Periods" domClassName="backtestDataH2" 
            v-if="h2Periods.length" 
          />
        </b-col>

        <b-col>
          <wma-graph :periods="h2LivePeriods" domClassName="liveDataH2" 
            v-if="h2LivePeriods.length" 
          />
        </b-col>
      </b-row>

      <hr />

      <p class="lead"> H1 </p>

      <b-row>
        <b-col>
          <wma-graph :periods="h1Periods" domClassName="backtestDataH1" 
            v-if="h1Periods.length" 
          />
        </b-col>

        <b-col>
          <wma-graph :periods="h1LivePeriods" domClassName="liveDataH1" 
            v-if="h1LivePeriods.length" 
          />
        </b-col>
      </b-row>

      <hr />

      <p class="lead"> M5 </p>

      <b-row>
        <b-col>
          <wma-graph :periods="focusedPeriods" domClassName="backtestDataM5" 
            v-if="focusedPeriods.length" 
          />
        </b-col>

        <b-col>
          <wma-graph :periods="focusedLivePeriods" domClassName="liveDataM5" 
            v-if="focusedLivePeriods.length" 
          />
        </b-col>
      </b-row>
    </div>
  </app-template>
</template>

<script>
import * as _ from 'lodash';
import AppTemplate from '@/components/patterns/AppTemplate'
import { fetchCachedCalcPeriods, fetchLiveCalcPeriods } from '@/http/simulate-history';
import WmaGraph from '@/components/Simulator/AnalyseTrade/WmaGraph';
import GranWmaLineGraph from '@/components/Monitor/children/GranWmaLineGraph';


// const OPEN_DATE = '2020-06-01T05:25:00.000Z'
// const CLOSE_DATE = '2020-06-01T05:30:00.000Z'
// const OPEN_DATE = null
// const CLOSE_DATE = null
// const BUFFER = 40


export default {
  components: {
    AppTemplate,
    WmaGraph,
    GranWmaLineGraph
  },

  data() {
    return {
      symbol: 'GBPCAD',
      periods: [],
      livePeriods: [],
      openDate: null,
      closeDate: null,
      buffer: 40,
      focusedPeriods: [],
      focusedLivePeriods: []
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

    h1LivePeriods() {
      return this.abstractLiveUpperPeriods('H1')
    },

    h2LivePeriods() {
      return this.abstractLiveUpperPeriods('H2')
    },
  },

  methods: {
    refocus() {
      console.log('refocus')
      this.focusedPeriods = this.focusPeriods(this.periods)
      this.focusedLivePeriods = this.focusPeriods(this.livePeriods)
    },

    uploadPeriods() {
       fetchCachedCalcPeriods('2020-06-01T00:00:00.000Z', new Date(), 0, 'M5')()
        .then(res => {
          this.periods = res
          this.focusedPeriods = res
        })
    },

    uploadLivePeriods() {
      fetchLiveCalcPeriods('2020-06-01T00:00:00.000Z', new Date(), 0, 'M5')()
        .then(res => {
          this.livePeriods = res
          this.focusedLivePeriods = res
        })
    },

    focusPeriods(periods) {
      if (!this.openDate || !this.closeDate) return periods 

      const focusedPeriods = _.cloneDeep(periods)

      const openDateIndex = focusedPeriods.findIndex((x) => 
        new Date(x.date) >= new Date(this.openDate) 
      )
      focusedPeriods.splice(0, openDateIndex - this.buffer)

      const closeDateIndex = focusedPeriods.findIndex((x) => 
        new Date(x.date) >= new Date(this.closeDate)
      )
      focusedPeriods.splice(closeDateIndex + this.buffer, focusedPeriods.length)

      return focusedPeriods
    },

    abstractUpperPeriods(gran) {
      if (!this.focusedPeriods.length) return []

      return this.focusedPeriods.map((x) => ({
        date: x.upperPeriods[gran].date,
        rate: x.upperPeriods[gran].rate,
        exchange_rate: x.upperPeriods[gran].rate,
        wma: x.upperPeriods[gran].wma
      }))
    },

    abstractLiveUpperPeriods(gran) {
      if (!this.focusedLivePeriods.length) return []

      return this.focusedLivePeriods.map((x) => ({
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
  margin-left: -450px;
  /* border: 1px solid pink; */
  width: 2000px;
}
</style>