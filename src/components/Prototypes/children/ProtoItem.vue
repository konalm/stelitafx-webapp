<template>
  <b-col cols="3" class="my-3">
    <b-card>
      <p class="lead">prototype #{{ proto.prototype_no }}</p>
      <p><small>{{ proto.description }}</small></p>

      <!-- pie graph -->
      <div v-bind:id="'pieGraph' + proto.prototype_no" class="mt-3 text-center" 
        v-bind:class="{'d-none': !trades.length}"
      ></div>

      <section v-if="!loading" class="text-center mt-1">
        <section v-if="trades.length">
          <p class="text-center">
            Gained: {{ pips.gained }} | Lost: {{ pips.lost }}
          </p>

          <p class="lead text-center mt-1" 
            v-bind:class="{'text-success': gainedPercent >= 70}"
          >
            {{ gainedPercent }} %
          </p>

          <p class="mt-2">Total trades: {{ trades.length }}</p>
          
          <p> W {{ winningTradeCount }} | L {{ losingTradeCount }} </p>

          <p v-bind:class="{'text-success': winningTradePercent >= 65}">
            {{ winningTradePercent }} %
          </p>
        </section>

        <b-alert show ariant="warning" class="mt-3" v-else> No trades! </b-alert>
      </section>

      <p class="text-center" v-else>
        <b-spinner variant="primary" label="Spinning" />
      </p>

      <router-link class="2-10" :to="{
        name: 'PrototypeAnalysis', 
        params: {
          no: proto.prototype_no,
          interval: this.timeInterval
      }}">
        <b-button variant="primary" class="mt-2 w-100">View</b-button>
      </router-link>
    </b-card>
  </b-col>
</template>


<script>
import { buildPieGraph, clearPieGraph } from '@/graph/pieGraph';
import { calcPercentangeOfGain } from '@/services/utils';
import { getHttpRequest } from '@/http/apiRequestV2';
import { mapGetters } from 'vuex';

export default {
  props: {
    proto: {
      type: Object,
      required: true,
      default: {
        prototype_no: 0,
        description: ''
      }
    },
    timeInterval: {
      type: Number,
      required: false,
      default: 1
    },
    filteredDate: {
      type: [Date, String],
      required: true
    },
    currencyRateSource: {
      type: String,
      required: false
    }
  },

  data() {
    return {
      trades: [],
      loading: false
    }
  },

  beforeMount() {
    this.uploadTrades()
  },

  computed: {
    pips() {
      if (!this.trades || this.trades.length === 0) return { gained: 0, lost: 0 }

      let gained = 0
      let lost = 0
      this.trades.forEach((trade) => {
        if (trade.pips > 0) gained += trade.pips
        if (trade.pips < 0) lost += trade.pips * -1
      })

      return { gained, lost }
    },

    winningTradeCount() {
      const trades = this.trades.filter((trade) => ( trade.pips > 0 ))
      return trades.length
    },

    losingTradeCount() {
      const trades = this.trades.filter((trade) => ( trade.pips < 0 ))
      return trades.length
    },

    gainedPercent() {
      return calcPercentangeOfGain(this.pips.gained, this.pips.lost).toFixed(0)
    },

    winningTradePercent() {
      return calcPercentangeOfGain(this.winningTradeCount, this.losingTradeCount).toFixed(0)
    }
  },

  methods: {
    async uploadTrades() {
      this.loading = true
      
      let params = {}
      let path = `/protos/${this.proto.prototype_no}/intervals/${this.timeInterval}/trades`
      if (this.filteredDate) params.date= this.filteredDate 
      params.currencyRateSource = this.currencyRateSource

      this.trades = []
      try {
        this.trades = await getHttpRequest(path, params)
      } catch (err) {
        console.error(`Failed to upload trades for proto ${this.proto.prototype_no}`)
      } finally {
        this.loading = false
      }
    }
  },

  watch: {
    loading() {
      clearPieGraph(this.proto.prototype_no)
      buildPieGraph(this.proto.prototype_no, this.pips.gained, this.pips.lost);
    },

    pips() {
      clearPieGraph(this.proto.prototype_no)
      buildPieGraph(this.proto.prototype_no, this.pips.gained, this.pips.lost);
    },

    filteredDate() {
      this.uploadTrades()
    },

    timeInterval() {
      this.uploadTrades()
    },

    currencyRateSource() {
      this.uploadTrades()
    }
  }
}
</script>
