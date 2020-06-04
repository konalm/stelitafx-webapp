<template>
  <b-card>
    <p v-for="stat in performanceStats" :key="stat.stat"> 
      {{ stat.stat }} : {{ stat.value }}
    </p>
  </b-card>
</template>

<script>
import { calcPercentangeOfGain } from '@/services/utils';

export default {
  props: {
    performance: {
      type: Object,
      required: false,
      default: function() { return {} }
    }
  },

  computed: {
    performanceStats() {
      const stats = []
      for (let [k, v] of Object.entries(this.performance)) {
        stats.push({stat: k, value: v})
      }

      return stats
    }
  }
}
</script>

<style>

</style>