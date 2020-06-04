<template>
  <div>
    <p class="lead">{{ gran }}</p>
    
    <line-graph :trade="trade" :wmaData="wmaData" :protoNo="protoNo"
      :tradeOpenIndex="tradeOpenIndex"
      :tradeCloseIndex="tradeCloseIndex"
      :domId="lineGraphDomId"
    />
  </div>
</template>

<script>
import LineGraph from './LineGraph';
import { getHttpRequest } from '@/http/apiRequestV2';


export default {
  components: {
    LineGraph
  },

  props: {
    protoNo: {
      type: Number,
      required: true 
    },

    gran: {
      type: String,
      required: true
    },

    currency: {
      type: String,
      required: true
    },

    tradeUUID: {
      type: String,
      required: true
    },

    buffer: {
      type: Number,
      required: false,
      default: 40
    },

    trade: {
      type: Object,
      default: {},
      required: true
    },

    tradeOpenIndex: {
      type: Number,
      required: true
    },

    tradeCloseIndex: {
      type: Number,
      required: true
    }
  },

  beforeMount() {
    this.uploadWMAData()
  },

  computed: {
    lineGraphDomId() {
      return `${this.gran}tradeAnalysisLineGraph`
    }
  },

  methods: {
    uploadWMAData() {
      this.wmaData = [];

      const path = `/wma/${this.protoNo}/interval/${this.gran}/${this.currency}/trade/${this.tradeUUID}?buffer=${this.buffer}`
      getHttpRequest(path)
        .then(res => {

          console.log('wma data response ---->')
          console.log(res)

          this.wmaData = res;
        })
        .catch(err => {
          throw new Error(`uploading WMA data for Algo currency trade: ${err}`);
        }) 
    },
  }
}
</script>