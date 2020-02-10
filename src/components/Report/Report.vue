<template>
  <app-template>
    <!-- filter report by -->
    <b-row>
      <b-col cols="3">
        <date-filter v-model="dateFilter" />
      </b-col>
    </b-row>

    <hr />

    <b-row>
      <report-day v-for="(report, i) in reports" :key="i"
        :date="report.date"
        :trades="report.trades"
      />
    </b-row>
    
  </app-template>
</template>

<script>
import AppTemplate from '@/components/patterns/AppTemplate';
import { getPrototypeIntervalTrades } from '@/http/trade';
import DateFilter from '@/components/patterns/DateFilter';
import { stringHMSFromDate } from '@/services/utils'
import ReportDay from './child/ReportDay'

export default {
  components: {
    AppTemplate,
    DateFilter,
    ReportDay
  },

  data() {
    return {
      trades: [],
      dateFilter: ''
    }
  },

  beforeMount() {
    this.uploadTrades()
  },

  computed: {
    reports() {
      const end = stringHMSFromDate()
      const beginning = stringHMSFromDate(this.dateFilter)
      const timeDiff = end.getTime() - beginning.getTime()
      const diffInDays = Math.round( timeDiff / (1000 * 3600 * 24)) / 1 * 1

      const reports = []

      /* loop for each day to generate a report for */ 
      for (let i = 0; i <= diffInDays; i ++) {
        const d = new Date()
        d.setDate(d.getDate() - i)
        const reportDate = stringHMSFromDate(d)
        const trades = this.getTradesForDate(reportDate, this.trades)
        reports.push({ 
          date: reportDate, 
          trades 
        })
      }

      return reports
    }
  },

  methods: {
    uploadTrades() {
      getPrototypeIntervalTrades(1, 1, null)
        .then(res => {
          this.trades = res
        })
    },

    getTradesForDate(date) {
      const year = date.getFullYear()
      const month = date.getMonth()
      const day = date.getDate()

      if (!this.trades || !this.trades.length) return

      return this.trades.filter((x) => {
        const d = new Date(x.closeDate)

        return d.getFullYear() === year && 
          d.getMonth() === month &&
          d.getDate() == day
      })
    }
  }

}
</script>

<style>

</style>