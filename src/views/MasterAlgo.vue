<template>
  <app-template>
    <b-container>
      <p class="lead">{{ masterAlgo.description }}</p>

      <ul class="list-group mt-4">
        <algo-item v-for="id in masterAlgo.algorithmIds" :key="id" :algoId="id"  />
      </ul>
    </b-container>
  </app-template>
</template>


<script>
import { fetchStrategyMasterAlgo } from '@/http/strategy'
import AppTemplate from '@/components/patterns/AppTemplate'
import AlgoItem from '@/components/MasterAlgo/AlgoStats'


export default {
  components: {
    AppTemplate,
    AlgoItem
  },

  data() {
    return {
      masterAlgo: {}
    }
  },

  beforeMount() {
    this.uploadMasterAlgo()
  },

  computed: {
    strategyUUID() {
      return this.$route.params.strategyUUID
    },

    masterAlgoUUID() {
      return this.$route.params.masterAlgoUUID
    }

  },

  methods: {
    uploadMasterAlgo() {
      fetchStrategyMasterAlgo(this.strategyUUID, this.masterAlgoUUID)()
        .then(res => {
          this.masterAlgo = res
        })
    }
  }
}
</script>