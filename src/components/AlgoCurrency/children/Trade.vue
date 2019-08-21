<template>
  <li class="list-group-item" v-bind:class="{
    'viewed': trade.viewed,
    'in-view': inView}"
    v-on:click="redirectToTrade()"
  >
    <!-- header -->
    <div class="row">
      <div class="col header p-2">
        <p v-bind:class=" {
          'text-success': trade.pips > 0,
          'text-danger': trade.pips < 0
        }">
          <b>{{ trade.pips }}</b>
        </p>

        <p>{{ duration }}</p>

        <p v-if="!summary">{{ formatDate(trade.closeDate) }}
          {{ formatTime(trade.closeDate) }}
        </p>
      </div>
    </div>

    <div class="row p-2">
      <!-- close -->
      <div class="col sell rounded py-2">
        <p>
          <b>
            {{ formatDate(trade.closeDate) }}
            <span class="ml-2">{{ formatTime(trade.closeDate) }}</span>
          </b>
        </p>

        <p class="lead" v-if="!summary"> <i class="fas fa-arrow-down"></i>
          {{ trade.closeRate }} </p>
      </div>

      <div class="mx-1"></div>

      <!-- open -->
      <div class="col buy rounded py-2" v-if="!summary">
        <p>
          <b>{{ formatDate(trade.openDate) }}
            <span class="ml-2">{{ formatTime(trade.openDate) }}</span>
          </b>
        </p>

        <p class="lead"> <i class="fas fa-arrow-up"></i>
          {{ trade.openRate }}
        </p>
      </div>
    </div>
  </li>
</template>


<script>
import moment from 'moment'
import { durationOfTrade } from '@/services/utils'

export default {
  props: {
    trade: Object,
    summary: {
      type: Boolean,
      required: false,
      default: false
    },
    inView: {
      type: Boolean,
      required: false,
      default: true
    }
  },

  data() {
    return {
      subView: 1
    }
  },

  computed: {
    duration() {
      return durationOfTrade(this.trade.openDate, this.trade.closeDate)
    },

    currency() {
      return this.$route.params.currency;
    },
  },

  methods: {
    formatDate(date) {
      return moment(date).format('DD/MM/YYYY')
    },

    formatTime(date) {
      return moment(date).format('HH:mm')
    },

    redirectToTrade() {
      this.$router.push({
        name: 'AlgoCurrencyTrade',
        params: {
          current: this.currency,
          tradeId: this.trade.id
        }
      })
    },
  }
}
</script>


<style lang="scss" scoped>
.list-group-item {
  cursor: pointer;

  &.in-view {
    box-shadow: 0 1px 5px rgba(0,0,0,0.3);
  }

}

.viewed {
  background: rgba(0,0,0,0.06);
}
</style>
