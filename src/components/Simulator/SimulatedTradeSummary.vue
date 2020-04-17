<template>
  <b-col cols="3" class="my-3" v-on:click="$emit('click')">
    <b-card v-bind:class="{'highlight': active}">
      <p> {{ formatDate(openTrade.date) }} - {{ formatDate(closeTrade.date) }} </p>
      <p> {{ formatTime(openTrade.date) }} - {{ formatTime(closeTrade.date) }} </p>
      <p> {{ stats.pips }} </p>
      <p> Duration   {{ stats.duration }} </p>
      <p> Triggered stop loss: {{ closeTrade.triggeredStopLoss }} </p>
    </b-card>
  </b-col>
</template>


<script>
import { formatDate, formatTime } from '@/services/utils'

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
    stats: {
      pips: 0.00,
      duration: 0
    },
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
  }
}
</script>


<style scoped>
.card.highlight {
  background: rgb(235,235,235)
}
</style>