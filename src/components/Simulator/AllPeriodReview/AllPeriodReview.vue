<template>
  <div>
    <wma-line-graph :periods="periods" />
    <obc-line-graph :periods="periods" />
    <stochastic-line-graph :periods="periods" />
    <adx-line-graph :periods="periods" />
  </div>
</template>

<script>
import WmaLineGraph from './WmaLineGraph'
import ObcLineGraph from './ObcLineGraph'
import StochasticLineGraph from './StochasticLineGraph'
import AdxLineGraph from './AdxLineGraph'
import { fetchCachedCalcPeriods } from '@/http/simulate-history';


export default {
  components: {
    WmaLineGraph,
    ObcLineGraph,
    StochasticLineGraph,
    AdxLineGraph
  },

  data() {
    return {
      periods: []
    }
  },

  beforeMount() {
    this.uploadPeriods()
  },

  methods: {
    uploadPeriods() {
      fetchCachedCalcPeriods()
      .then((res) => {
        this.periods = res.splice(0, 250)
      })
    }
  }
}
</script>
