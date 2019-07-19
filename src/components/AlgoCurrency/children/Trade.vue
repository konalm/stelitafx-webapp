<template>
  <li class="list-group-item">
    <!-- header -->
    <div class="row">
      <div class="col header p-2">
        <p v-bind:class=" {
          'text-success': pips > 0,
          'text-danger': pips < 0
        }">
          <b>{{ pips }}</b>
        </p>

        <p>Time between: {{ trade.minsBetween }} mins</p>
        <p>Date time: {{ formatDate(trade.sell.date) }}
          {{ formatTime(trade.sell.date) }}
        </p>
      </div>
    </div>

    <div class="row">
      <!-- sell -->
      <div class="col sell" v-if="trade.hasOwnProperty('sell')">
        <p> {{ trade.sell.id }} </p>

        <p>
          <b>
            {{ formatDate(trade.sell.date) }}
            <span class="ml-2">{{ formatTime(trade.sell.date) }}</span>
          </b>
        </p>


        <p class="lead"> <i class="fas fa-arrow-down"></i>
          {{ trade.sell.rate }} </p>
      </div>

      <!-- buy -->
      <div class="col buy" v-if="trade.hasOwnProperty('buy')">
        <p>{{ trade.buy.id }}</p>

        <p>
          <b>{{ formatDate(trade.buy.date) }}
            <span class="ml-2">{{ formatTime(trade.buy.date) }}</span>
          </b>
        </p>

        <p class="lead"> <i class="fas fa-arrow-up"></i>
          {{ trade.buy.rate }} </p>
      </div>
    </div>

    <b-row class="mt-3">
      <b-col class="text-center">
        <router-link :to="{
          name: 'AlgoCurrencyTrade',
          params: {
            currency: currency,
            buyTradeId: trade.buy.id,
            sellTradeId: trade.sell.id
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
import pipCalculator from '@/services/pipCalculator';

export default {
  props: {
    trade: Object,
  },

  data() {
    return {

    }
  },

  computed: {
    currency() {
      return this.$route.params.currency;
    },

    pips() {
      return pipCalculator(this.trade.buy.rate, this.trade.sell.rate);
    }
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
