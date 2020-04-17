<template>
  <app-template>
    <b-container>
      <b-row>
        <summary-card v-for="strategy in strategies" :key="strategy.UUID" 
          :strategySummary="strategy"
        />
      </b-row>
    </b-container>
  </app-template>
</template>

<script>
import { fetchStrategies } from '@/http/strategy';
import AppTemplate from '@/components/patterns/AppTemplate';
import SummaryCard from '@/components/Strategies/SummaryCard';

export default {
  components: {
    AppTemplate,
    SummaryCard
  },

  beforeMount() {
    this.uploadStrategies()
  },

  data() {
    return {
      strategies: []
    }
  },

  methods: {
    uploadStrategies() {
      fetchStrategies()
        .then(res => {
          this.strategies = res
        })
    }
  }
}
</script>

<style>

</style>