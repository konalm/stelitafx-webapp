<template>
  <app-template>
    <b-row>
      <b-col col lg="2">
        <b-form-select v-model="protoNo" :options="protoOptions" />
      </b-col>
    </b-row>

    <b-row class="mt-5" v-for="currency in majorCurrencies" :key="currency">
      <b-col>
        <b-row>
          <b-col>
            <p class="lead">{{ currency }}</p>
          </b-col>
        </b-row>

        <b-row class="mt-2">
          <b-col>
            <ul>
              <li v-for="(indicator, key) in protoCurrencyAlgoData[currency]" 
                :key="key"
                class="mt-2"
              >
                {{ key }}: {{ indicator }}
              </li>
            </ul>
          </b-col>

          <b-col>
            <currency-graph :currency="currency" />
          </b-col>
        </b-row>
      </b-col>
    </b-row>
  </app-template>
</template>

<script>
import AppTemplate from '@/components/patterns/AppTemplate'
import CurrencyGraph from '@/components/patterns/CurrencyGraph'
import { getHttpRequest } from '@/http/apiRequestV2';

export default {
  components: {
    AppTemplate,
    CurrencyGraph
  },

  data() {
    return {
      majorCurrencies: ['GBP', 'EUR', 'JPY', 'AUD'],
      protoNo: 1,
      protoCurrencyAlgoData: {
        'GBP': [],
        'EUR': [],
        'JPY': [],
        'AUD': []
      },
      protoOptions: []
    }
  },

  beforeMount() {
    this.uploadProtoAlgoData()
    this.uploadProtoOptions()
    this.refreshProtoAlgoData()
  },

  methods: {
    uploadProtoAlgoData() {
      this.majorCurrencies.forEach((currency) => {
        this.uploadProtoAlgoCurrencyData(currency)
      })
    },

    uploadProtoAlgoCurrencyData(currency) {
      const path = `protos/${this.protoNo}/algo-data/${currency}`
      getHttpRequest(path)
        .then(res => {
          this.protoCurrencyAlgoData[currency] = res
        })
    },

    uploadProtoOptions() {
      getHttpRequest('protos')
        .then(res => {
          this.protoOptions = res.map(x => ({
            value: x.prototype_no,
            text: x.prototype_no
          }))
        })
    },

    refreshProtoAlgoData() {
      
      setInterval(() => {
        this.uploadProtoAlgoData()
      }, 15000)
    }
  },

  watch: {
    protoNo() {
      this.uploadProtoAlgoData()
    }
  }
}
</script>
