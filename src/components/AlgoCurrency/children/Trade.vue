<template>
  <li class="list-group-item">
    <!-- header -->
    <div class="row">
      <div class="col header p-2">
        <p v-bind:class=" {
          'text-success': trade.pips > 0,
          'text-danger': trade.pips < 0
        }">
          <b>{{ trade.pips }}</b>
        </p>

        <p>{{ minsTradeWasOpen }} mins</p>
        <p>{{ formatDate(trade.closeDate) }}
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

        <p class="lead"> <i class="fas fa-arrow-down"></i>
          {{ trade.closeRate }} </p>
      </div>

      <div class="mx-1"></div>

      <!-- open -->
      <div class="col buy rounded py-2">
        <p>
          <b>{{ formatDate(trade.openDate) }}
            <span class="ml-2">{{ formatTime(trade.openDate) }}</span>
          </b>
        </p>

        <p class="lead"> <i class="fas fa-arrow-up"></i>
          {{ trade.openRate }} </p>
      </div>
    </div>

    <b-row class="mt-3">
      <b-col class="text-center">
        <router-link :to="{
          name: 'AlgoCurrencyTrade',
          params: {
            currency: currency,
            tradeId: trade.id,
          }
        }">
          <b-button variant="secondary">Analysis Trade</b-button>
        </router-link>
      </b-col>
    </b-row>
  </li>
</template>


<script>
import moment from 'moment';

export default {
  props: {
    trade: Object,
  },

  data() {
    return {
      subView: 1
    }
  },

  computed: {
    minsTradeWasOpen() {
      const openDate = new Date(this.trade.openDate);
      const closeDate = new Date(this.trade.closeDate);
      const diffMs = (closeDate - openDate);

      return Math.round(((diffMs % 86400000) % 3600000) / 60000); // minutes
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
  }
}
</script>
