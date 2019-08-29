<template>
  <app-template>
    <b-row>
      <b-col col lg="2">
        <b-form-select v-model="protoNo" :options="protoOptions" />
      </b-col>
    </b-row>

    <monitor-currency v-for="currency in majorCurrencies" :key="currency"
      :protoNo="protoNo"
      :currency="currency" 
    />
  </app-template>
</template>

<script>
import AppTemplate from '@/components/patterns/AppTemplate'
import MonitorCurrency from './children/MonitorCurrency'
import { getHttpRequest } from '@/http/apiRequestV2';

export default {
  components: {
    AppTemplate,
    MonitorCurrency
  },

  data() {
    return {
      majorCurrencies: ['GBP', 'EUR', 'JPY', 'AUD'],
      protoNo: 1,
      protoOptions: []
    }
  },

  beforeMount() {
    this.uploadProtoOptions()
  },

  methods: {
    uploadProtoOptions() {
      getHttpRequest('protos')
        .then(res => {
          this.protoOptions = res.map(x => ({
            value: x.prototype_no,
            text: x.prototype_no
          }))
        })
    },
  }
}
</script>
