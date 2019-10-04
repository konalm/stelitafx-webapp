<template>
  <app-template>
    <b-row class="my-3">
      <b-col cols lg="3">
        <date-filter />
      </b-col>

      <b-col cols lg="3">
        <time-interval v-model="timeInterval" />
      </b-col>
    </b-row>

    <b-row> <b-col> <hr /> </b-col> </b-row>

    <b-row>
      <proto-item v-for="proto in algos" :key="proto.prototype_no" 
        :timeInterval="timeInterval"
        :proto="proto"
      />
    </b-row>
  </app-template>
</template>


<script>
import AppTemplate from '@/components/patterns/AppTemplate';
import { algosHttpGetRequest } from '@/http/algos';
import { getHttpRequest } from '@/http/apiRequestV2';
import ProtoItem from './children/ProtoItem';
import DateFilter from '@/components/patterns/DateFilter'
import TimeInterval from '@/components/patterns/TimeInterval'

export default {
  components: {
    AppTemplate,
    ProtoItem,
    DateFilter,
    TimeInterval
  },

  data() {
    return {
      algos: [],
      timeInterval: 1, 
    }
  },

  beforeMount() {
    this.timeInterval = parseInt(this.$route.params.interval)
    this.uploadPrototypes()
  },

  methods: {
    async uploadPrototypes() {
      algosHttpGetRequest()
        .then(res => {
          this.algos = res;
        })
        .catch(err => {
          console.error('Failed to upload Prototypes')
        })
    },
  },

  watch: {
    timeInterval(value) {
      this.$router.push({name: 'Prototypes', params: {interval: value}})
    }
  }
}
</script>
