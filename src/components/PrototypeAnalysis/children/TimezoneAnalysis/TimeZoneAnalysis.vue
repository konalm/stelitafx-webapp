<template>
  <div>
    <b-row class="mt-5">
      <b-col>
        <p class="lead"> Timezone analysis </p>

        <!-- <b-row class="mt-2">
          <time-zone-analysis-item v-for="timezone in timezones" :key="timezone.name"
            :name="timezone.name"
            :beginHour="timezone.begins"
            :endHour="timezone.ends"
            :trades="trades"
          />
        </b-row> -->
      </b-col>
    </b-row>

    <b-row class="mt-2">
      <currency-timezone-analysis v-for="abbrev in abbrevs" :key="abbrev.abbrev"
        :abbrev="abbrev.abbrev"
        :timezoneName="abbrev.timezoneName"
        :trades="trades"
        :beginHour="abbrev.begins"
        :endHour="abbrev.ends"
      />
    </b-row>
  </div>
</template>

<script>
import { formatTime } from '@/services/utils'
import TimeZoneAnalysisItem from './child/TimeZoneAnalysisItem.vue'
import CurrencyTimezoneAnalysis from './child/CurrencyPerformance.vue'

export default {
  components: {
    TimeZoneAnalysisItem,
    CurrencyTimezoneAnalysis
  },

  props: {
    trades: {
      type: Array,
      required: true
    }
  },

  data() {
    return {}
  },

  computed: {
    timezones() { 
      return [
        {
          name: 'Asian',
          begins: 23,
          ends: 8
        },
        {
          name: 'European',
          begins: 7,
          ends: 16 
        },
        {
          name: 'North American',
          begins: 12,
          ends: 20
        }
      ]
    },

    abbrevs() {
      return [
        {
          abbrev: 'GBP/USD',
          timezoneName: 'European',
          begins: 8,
          ends: 15
        },
        //  {
        //   abbrev: 'GBP/USD',
        //   timezoneName: 'European',
        //   begins: 12,
        //   ends: 15
        // },
        {
          abbrev: 'EUR/USD',
          timezoneName: 'European',
          begins: 7,
          ends: 16
        },
        {
          abbrev: 'AUD/USD',
          timezoneName: 'Asian',
          begins: 23,
          ends: 8
        }
      ]
    }
  },

  methods: {
    getPipsGained(trades) {
      return trades.reduce((sum, trade) => {
        const v = trade.pips > 0 ? trade.pips : 0
        return sum + v
      }, 0)
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

<style>

</style>