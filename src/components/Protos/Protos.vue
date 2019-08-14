<template>
  <app-template>
    <b-row>
      <b-col cols lg="3">
        <date-filter />
      </b-col>
    </b-row>

    <b-row>
      <b-col> <hr /> </b-col>
    </b-row>

    <b-row>
      <proto-item v-for="proto in algos" :key="proto.prototype_no"
        :proto="proto"
      />
    </b-row>
  </app-template>
</template>


<script>
import AppTemplate from '@/components/patterns/AppTemplate';
import { algosHttpGetRequest } from '@/http/algos';
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
    }
  },

  beforeMount() {
    this.uploadAlgos()
  },

  methods: {
    async uploadAlgos() {
      algosHttpGetRequest()
        .then(res => {
          this.algos = res;
        })
    },
  },
}
</script>
