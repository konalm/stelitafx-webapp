<template>
  <b-col>
    <b-card :title="name">
      <p> Begin {{ formatTime(begins) }} </p>
      <p> End {{  formatTime(ends) }} </p>
      {{ tradesOutsizeZone.length }}

      <p class="mt-2"><b>Trades inside zone</b></p>
      <performance :trades="tradesInZone" />

      <p class="mt-2"><b>Trades outside zone</b></p>
      <performance :trades="tradesOutsizeZone" />
    </b-card>
  </b-col>
</template>


<script>
import { formatTime } from '@/services/utils'
import Performance from './Performance.vue'

export default {
  components: {
    Performance
  },
  
  props: {
    name: {
      type: String,
      required: true
    },

    trades: {
      type: Array,
      required: true
    },
  
    beginHour: {
      type: Number,
      required: true
    },

    endHour: {
      type: Number,
      required: true
    }
  },

  data() {
    return {}
  },

  computed: {
     begins() {
      return this.dateByHour(this.beginHour)
    },

    ends() {
      return this.dateByHour(this.endHour)
    },

    tradesInZone() {
      return this.trades.filter((x) => {
        const openDate = new Date(x.openDate)
        const closeDate = new Date(x.closeDate)

        return openDate.getHours() >= this.beginHour 
          && closeDate.getHours() <= this.endHour + 1
      })
    },

    tradesOutsizeZone() {
      return this.trades.filter((x) => 
        this.tradesInZone.filter((y) => y.id === x.id).length === 0
      )
    }
  },

  methods: {
    formatTime(date) {
      return formatTime(date)
    },

    tradesFormatted(trades) {
      return trades.map(x => ({
        openDate: formatTime(x.openDate),
        closeDate: formatTime(x.closeDate),
        pips: x.pips
      }))
    },

    getTradesBetweenHours(beginHour, endHour) {
      return this.trades.filter((x) => {
        const openDate = new Date(x.openDate)
        const closeDate = new Date(x.closeDate)

        return openDate.getHours() >= beginHour && closeDate.getHours() <= endHour + 1
      })
    },

    tradesFormatted(trades) {
      return trades.map(x => ({
        openDate: formatTime(x.openDate),
        closeDate: formatTime(x.closeDate),
        pips: x.pips
      }))
    },

    dateByHour(hour) {
      const d = new Date()
      d.setHours(hour)
      d.setMinutes(0)
      d.setSeconds(0)
      d.setMilliseconds(0)

      return d
    }
  }
}
</script>
