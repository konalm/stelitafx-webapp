<template>
  <app-template>
    <b-container>
      <b-row>
        <b-col cols="2">
          {{ currency }}
          {{ prototype }}
          {{ timeInterval }}
          <b-form-select v-model="currency" :options="currencyOptions" />
          <b-form-select v-model.number="prototype" :options="prototypeOptions" 
            class="mt-2" 
          />
          <b-form-select v-model.number="timeInterval" :options="timeIntervalOptions" 
            class="mt-2" 
          />

          <b-button variant="primary" class="mt-4 w-100"> Update graph </b-button>
        </b-col>

        <b-col cols="10">
          <chart :currency="currency" :prototype="prototype" :interval="timeInterval" />  
        </b-col>
      </b-row>
    </b-container>
  </app-template>
</template>


<script>
import AppTemplate from '@/components/patterns/AppTemplate';
import Chart from '@/components/patterns/Chart';

export default {
  components: {
    AppTemplate,
    Chart
  },

  data() {
    return {
      currencyOptions: [],
      prototypeOptions: [],
      timeIntervalOptions: [],
      currency: '',
      prototype: 1,
      timeInterval: 15
    }
  },

  beforeMount() {
    this.uploadCurrencyOptions()
    this.uploadPrototypeOptions()
    this.uploadTimeIntervalOptions()
  },

  methods: {
    uploadCurrencyRateWMAData() {
      console.log('upload currency rate WMA data')


    },

    uploadCurrencyOptions() {
      this.$store.dispatch('currency/getCurrencyAbbrevs')
        .then(res => {
          this.currencyOptions = res.map(x => ({
            text: x.baseAbbrev,
            value: x.pairAbbrev
          }))
          this.currency = this.currencyOptions[0].value
        })
    },

    uploadPrototypeOptions() {
      this.$store.dispatch('prototype/getPrototypes')
        .then(res => {
          this.prototypeOptions = res.map(x => ({
            text: `#${x.prototype_no}`,
            value: parseInt(x.prototype_no)
          }))
          this.prototype = this.prototypeOptions[0].value
        })
    },

    uploadTimeIntervalOptions() {
      this.$store.dispatch('timeInterval/getIntervals')
        .then(res => {
          this.timeIntervalOptions = res.map(x => ({
            text: x,
            value: parseInt(x)
          }))
          this.timeInterval = this.timeIntervalOptions[0].value
        })
    }
  }
}
</script>

