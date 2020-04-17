<template>
  <section>
    <wma-graph :periods="periods" v-if="!loading" />  
    <b-spinner variant="primary" label="Spinning" v-if="loading" />
  </section>
</template>


<script>
import { fetchCachedCalcPeriods } from '@/http/simulate-history';
import WmaGraph from './WmaGraph';

const BUFFER = 40

export default {
  components: {
    WmaGraph
  },
  
  props: {
    trade: {
      type: Object,
      default: {}
    }
  },

  data() {
    return {
      periods: [],
      loading: false, 
    }
  },

  beforeMount() {
    console.log('analyse trade')
  },

  methods: {
    uploadPeriodsForTrade() {
      this.loading = true 
      const fromDate = this.trade.open.date 
      const toDate = this.trade.close.date 

      fetchCachedCalcPeriods(fromDate, toDate, BUFFER)()
        .then((res) => {
          this.periods = res
        })
        .finally(() => {
          this.loading = false 
        })
    }
  },

  watch: {
    trade() {
      console.log('Analyse Trade .. trade changed !!')
      this.uploadPeriodsForTrade()
    }
  }
}
</script>
