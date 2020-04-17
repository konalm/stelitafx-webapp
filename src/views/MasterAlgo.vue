<template>
  <app-template>
    <b-container>
      <p class="lead">{{ masterAlgo.description }}</p>

    </b-container>
  </app-template>
</template>


<script>
import { fetchStrategyMasterAlgo } from '@/http/strategy'

export default {
  components: {
    AppTemplate
  },

  data() {
    return {
      masterAlgo: {}
    }
  }
}
</script>