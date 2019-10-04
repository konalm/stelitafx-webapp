<template>
  <b-col cols="3" class="my-3">
    <b-card>
      <p class="lead">prototype #{{ proto.prototype_no }}</p>
      <p><small>{{ proto.description }}</small></p>

      <!-- pie graph -->
      <div v-bind:id="'pieGraph' + proto.prototype_no" class="my-3 text-center" 
        v-bind:class="{'d-none': !trades.length}"
      ></div>

      <section v-if="!loading" class="text-center">
        <section v-if="trades.length">
          <p class="text-center">
            Gained: {{ pips.gained }} | Lost: {{ pips.lost }}
          </p>

          <p class="lead text-center mt-3" 
            v-bind:class="{'text-success': gainedPercent >= 70}"
          >
            {{ gainedPercent }} %
          </p>
        </section>

        <b-alert show ariant="warning" class="mt-3" v-else>
          No trades!
        </b-alert>
      </section>

      <p class="text-center" v-else>
        <b-spinner variant="primary" label="Spinning" />
      </p>

      <router-link class="2-10" :to="{
        name: 'PrototypeAnalysis', 
        params: {
          no: proto.prototype_no,
          interval: this.timeInterval}
        }" 
      >
        <b-button variant="primary" class="mt-2 w-100">View</b-button>
      </router-link>
    </b-card>
  </b-col>
</template>


<script>
import { buildPieGraph, clearPieGraph } from '@/graph/pieGraph';
import { calcPercentangeOfGain } from '@/services/utils';
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
    ...mapGetters({
      dateFilter: 'dateFilter/filterDate'
    }),

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

    gainedPercent() {
      return calcPercentangeOfGain(this.pips.gained, this.pips.lost).toFixed(0)
    }
  },

  methods: {
    async uploadTrades() {
      this.loading = true
      try {
        const payload = {
          protoNo: this.proto.prototype_no,
          interval: this.timeInterval
        }
        this.trades = await this.$store.dispatch('trade/uploadProtoTrades', payload)
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

    dateFilter() {
      this.uploadTrades()
    },

    timeInterval() {
      this.uploadTrades()
    }
  }
}
</script>
