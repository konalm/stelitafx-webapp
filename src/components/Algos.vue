<template>
  <app-template>
    <b-row>
      <b-col v-for="algo in algos" :key="algo.prototype_no">
        <b-card>
            <p class="lead">prototype #{{ algo.prototype_no }}</p>
            <p><small>{{ algo.description }}</small></p>

            <router-link :to="{name: 'Proto', params: {id: algo.prototype_no}}">
              <b-button variant="primary" class="mt-4">View</b-button>
            </router-link>
        </b-card>
      </b-col>
    </b-row>
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
