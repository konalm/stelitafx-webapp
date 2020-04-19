<template>
  <app-template>
    <b-container>
      <b-row>
        <b-col>
          <p class="lead">{{ masterAlgo.description }}</p>

          <router-link :to="{name: 'Strategy', params: { UUID: strategyUUID }}">
            <b-button class="mt-3"> back </b-button>
          </router-link>
        </b-col>

        <b-col>
          <stats :masterAlgoUUID="masterAlgoUUID" />
        </b-col>
      </b-row>

      <ul class="list-group mt-4">
        <algo-item v-for="id in masterAlgo.algorithmIds" :key="id" :algoId="id"
          :strategyUUID="strategyUUID"
          :masterAlgoUUID="masterAlgoUUID"
        />
      </ul>
    </b-container>
  </app-template>
</template>


<script>
import { fetchStrategyMasterAlgo } from '@/http/strategy'
import AppTemplate from '@/components/patterns/AppTemplate'
import AlgoItem from '@/components/MasterAlgo/AlgoStats'
import Stats from '@/components/MasterAlgo/Stats'


export default {
  components: {
    AppTemplate,
    AlgoItem,
    Stats
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
    },
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