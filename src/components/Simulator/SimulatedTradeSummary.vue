<template>
  <b-col cols="3" class="my-3" v-on:click="$emit('click')">
    <b-card v-bind:class="{'highlight': active}">
      <p> {{ formatDate(openTrade.date) }} - {{ formatDate(closeTrade.date) }} </p>
      <p> {{ formatTime(openTrade.date) }} - {{ formatTime(closeTrade.date) }} </p>
      <p> pips {{ pips }}  </p>
    </b-card>
  </b-col>
</template>


<script>
import { formatDate, formatTime } from '@/services/utils'
import pipCalculator from '@/services/pipCalculator';

const trade = {
  abbrev: '',
  date: '',
  exchange_rate: '',
  wma: {}
}

export default {
  props: {
    openTrade: trade,
    closeTrade: trade,
    active: {
      type: Boolean,
      default: false
    }
  },

  methods: {
    formatDate(date) {
      return formatDate(date)
    },

    formatTime(date) {
      return formatTime(date)
    }
  },

  computed: {
    pips() {
      return pipCalculator(this.openTrade.exchange_rate, this.closeTrade.exchange_rate, 'GBPCAD')
    }
  }
}
</script>


<style scoped>
.card.highlight {
  background: rgb(235,235,235)
}
</style>