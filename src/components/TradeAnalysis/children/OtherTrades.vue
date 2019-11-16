<template>
  <div>
    <b-row class="mt-3">
      <b-col col lg="2" class="mt-4">
        <date-filter v-model="filteredDate" />
      </b-col>
    </b-row>

    <b-row class="mt-5">
      <b-col>
        <div class="trades__container">
          <trade v-for="trade in trades" :key="trade.id" :trade="trade"
            :summary="true"
            :inView="trade.id === tradeId"
            :prototypeNo="protoNo"
            class="item"
          />
        </div>
      </b-col>
    </b-row>
  </div>
</template>


<script>
import { getProtoIntervalCurrencyTrades } from '@/http/trade'
import Trade from '@/components/patterns/TradeSummaryCard'
import DateFilter from '@/components/patterns/DateFilter';
import { beginningOfDay } from '@/services/utils';


export default {
  components: {
    Trade,
    DateFilter
  },

  props: {
    tradeId: {
      type: Number,
      required: true
    },
    trade: {
      type: Object,
      required: true
    },

    protoNo: {
      type: Number,
      required: true
    },

    timeInterval: {
      type: Number,
      required: true
    },

    currency: {
      type: String,
      required: true
    }
  },

  data() {
    return {
      trades: [],
      filteredDate: beginningOfDay(0)
    }
  },

  beforeMount() {
    this.uploadTrades()
  },

  methods: {
    uploadTrades() {
      getProtoIntervalCurrencyTrades(
        this.protoNo,
        this.timeInterval,
        this.currency,
        this.filteredDate
      )
        .then(res => {
          this.trades = res
        })
        .catch(err => {
          console.error('Failed to upload other trades')
        })
    },
  },

  watch: {
    filteredDate() {
      this.uploadTrades()
    }
  }
}
</script>

<style>

</style>