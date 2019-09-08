<template>
  <app-template>
    <b-row class="my-3">
      <b-col cols lg="3">
        <date-filter />
      </b-col>

      <b-col cols lg="3">
        <b-form-select v-model="timeInterval" :options="timeIntervalOptions">
        </b-form-select>
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

export default {
  components: {
    AppTemplate,
    ProtoItem,
    DateFilter
  },

  data() {
    return {
      algos: [],
      timeInterval: 1,
      timeIntervalOptions: []
    }
  },

  beforeMount() {
    this.uploadAlgos()
    this.uploadTimeIntervals()
  },

  methods: {
    async uploadAlgos() {
      algosHttpGetRequest()
        .then(res => {
          this.algos = res;
        })
    },

    uploadTimeIntervals() {
      getHttpRequest('intervals')
        .then(res => {
          console.log(res)

          this.timeIntervalOptions = res.map((x) => ({
            value: x,
            text: x
          }))
        })
    }
  },
}
</script>
