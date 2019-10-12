<template>
  <app-template>
    <b-container>
      <b-row>
        <b-col cols="2">
          <b-form-select v-model="currency" :options="currencyOptions" />
        </b-col>

        <b-col cols="2">
          <b-form-select v-model.number="prototype" :options="prototypeOptions" />
        </b-col>

        <b-col cols="2">
          <b-form-select v-model.number="timeInterval" :options="timeIntervalOptions" />
        </b-col>
      </b-row>

      <b-row>
        <b-col>
          <chart :currency="currency" :prototype="prototype" :timeInterval="timeInterval" />  
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
      currency: 'GBP',
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
    uploadCurrencyOptions() {
      this.$store.dispatch('currency/getCurrencyAbbrevs')
        .then(res => {
          this.currencyOptions = res.map(x => ({
            text: x.baseAbbrev,
            value: x.baseAbbrev
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

