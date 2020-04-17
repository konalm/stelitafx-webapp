<template>
  <app-template>
    <b-container>
      <p class="lead">{{ strategy.name }}</p>
      <p><small>{{ strategy.description }} </small></p>
      
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
import { fetchStrategy } from '@/http/strategy';
import AppTemplate from '@/components/patterns/AppTemplate';
import MasterAlgoSummaryCard from '@/components/Strategy/MasterAlgoSummaryCard.vue';

export default {
  components: {
    AppTemplate,
    MasterAlgoSummaryCard
  },

  data() {
    return {
      strategy: {}
    }
  },

  beforeMount() {
    this.uploadStrategy()
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
    }
  }
}
</script>

<style>

</style>