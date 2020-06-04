<template>
  <div>
    <p class="lead"> {{ gran }} </p>
    <wma-graph :periods="periods" :domClassName="domClassName" v-if="periods.length" />
  </div>
</template>


<script>
import WmaGraph from '@/components/Simulator/AnalyseTrade/WmaGraph';
import { fetchCachedCalcPeriods } from '@/http/simulate-history';

export default {
  components: {
    WmaGraph
  },

  props: {
    gran: {
      type: String,
      default: ''
    }
  },

  data() {
    return {
      periods: []
    }
  },

  beforeMount() {
    this.uploadCachedCalcPeriodsForDuration()
  },

  computed: {
    domClassName() {
      return `${this.gran}__simulate__analyse_periods`
    }
  },

  methods: {
    uploadCachedCalcPeriodsForDuration() {
    console.log(`duration period .. upload cached calc periods for duration`)
    console.log(this.gran)

      fetchCachedCalcPeriods('2020-06-01T00:00:00.000Z', new Date(), 0, this.gran)()
        .then(res => {
          this.periods = res
        })
      }
  }
}
</script>