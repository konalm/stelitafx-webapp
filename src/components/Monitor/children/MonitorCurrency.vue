<template>
  <b-row class="mt-4">
    <b-col>
      <b-row>
        <b-col>
          <p class="lead">{{ currency }}</p>
        </b-col>
      </b-row>

      <b-row class="mt-2">
        <b-col>
          <b-alert show v-if="!lastTrade.closed"> 
            Trade open!
            <ul class="mt-2">
              <li>{{ lastTrade.openRate }}</li>
              <li>{{ lastTrade.openDate }}</li>
            </ul>
          </b-alert>

          <ul>
            <li v-for="(indicator, key) in algoData" :key="key">
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
</template>

<script>
import CurrencyGraph from '@/components/patterns/CurrencyGraph'
import { getHttpRequest } from '@/http/apiRequestV2';

export default {
  components: {
    CurrencyGraph
  },

  props: {
    currency: {
      type: String,
      required: true
    },
    protoNo: {
      type: Number,
      required: true
    }
  },

  data() {
    return {
      algoData: {},
      lastTrade: []
    }
  },

  beforeMount() {
    this.uploadAlgoData()
    this.refreshProtoAlgoData()
    this.uploadLastTrade()
  },

  methods: {
    uploadAlgoData() {
      const path = `protos/${this.protoNo}/algo-data/${this.currency}`
      getHttpRequest(path)
        .then(res => {
          this.algoData = res
        })
    },

    refreshProtoAlgoData() {
      setInterval(() => {
        this.uploadAlgoData()
        this.uploadLastTrade()
      }, 15000)
    },

    uploadLastTrade() {
      const path = `proto/${this.protoNo}/currency/${this.currency}/last-trade`
      getHttpRequest(path)
        .then(res => {
          this.lastTrade = res
        })
    }
  },

  watch: {
    protoNo() {
      this.uploadAlgoData()
      this.uploadLastTrade()
    }
  }
}
</script>
