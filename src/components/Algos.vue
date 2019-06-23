<template>
  <app-template>
    <b-list-group class="mt-4">
      <b-list-group-item v-for="algo in algos" :key="algo.prototype_no">
        <p class="lead">prototype {{ algo.prototype_no }}</p>
        <small>{{ algo.description }}</small>
      </b-list-group-item>
    </b-list-group>
  </app-template>
</template>


<script>
import AppTemplate from '@/components/patterns/AppTemplate';
import { algosHttpGetRequest } from '@/http/algos';


export default {
  components: {
    AppTemplate
  },

  data() {
    return {
      algos: []
    }
  },

  beforeMount() {
    this.uploadAlgos()
  },

  methods: {
    /**
     *
     */
    async uploadAlgos() {
      algosHttpGetRequest()
        .then(res => {
          this.algos = res;
        })
    }
  }
}
</script>
