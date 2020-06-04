<template>
  <app-template>
    <b-container>
      <b-row>
        <b-col>
          <p class="lead">{{ strategy.name }}</p>
          <p><small>{{ strategy.description }} </small></p>
        </b-col>

        <b-col>
          <time-interval v-model="timeInterval" class="mt-3" />
          <date-filter v-model="filteredDate" class="mt-3" />
          {{ filteredDate }}
        </b-col>
      </b-row>

      <b-row class="mt-4">
        <b-col>
          <stats :stats="stats" />
        </b-col>
      </b-row>
      
      <b-row class="mt-5">
        <master-algo-summary-card 
          v-for="masterAlgo in strategy.masterAlgos" :key="masterAlgo.UUID" 
          :strategyUUID="strategyUUID"
          :masterAlgoSummary="masterAlgo"
        />
      </b-row>
    </b-container>
  </app-template>  
</template>


<script>
import { fetchStrategy, fetchStats } from '@/http/strategy';
import AppTemplate from '@/components/patterns/AppTemplate';
import MasterAlgoSummaryCard from '@/components/Strategy/MasterAlgoSummaryCard.vue';
import Stats from '@/components/Strategy/Stats.vue'
import TimeInterval from '@/components/patterns/TimeInterval'
import DateFilter from '@/components/patterns/DateFilter'
import { beginningOfDay } from '@/services/utils';


export default {
  components: {
    AppTemplate,
    MasterAlgoSummaryCard,
    Stats,
    TimeInterval,
    DateFilter
  },

  data() {
    return {
      strategy: {},
      stats: {
        tradeAmount: 0,
        pips: {
          total: 0,
          winning: 0,
          losing: 0
        },
        trades: {
          winning: 0,
          losing: 0,
          winPercent: 0
        },
        avg: {
          total: 0,
          winning: 0,
          losing: 0
        }
      },
      timeInterval: 1,
      filteredDate: beginningOfDay(0)
    }
  },

  beforeMount() {
    this.uploadStrategy()
    this.uploadStats()
  },

  computed: {
    strategyUUID() {
      return this.$route.params.UUID
    }
  },

  methods: {
    uploadStrategy() {
      fetchStrategy(this.strategyUUID)()
        .then(res => {
          this.strategy = res
        })
    },

    uploadStats() {
      fetchStats(this.strategyUUID, this.timeInterval, this.filteredDate)()
        .then(res => {
          this.stats = res
        })
    }
  },

  watch: {
    timeInterval() {
      this.uploadStats()
    },
    filteredDate() {
      this.uploadStats()
    }
  }
}
</script>

<style>

</style>