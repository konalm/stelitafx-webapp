<template>
  <app-template>
    <b-row class="mt-5">
      <b-col class="text-center" v-for="currency in majorCurrencyAbbrevs">
        <b-card v-bind:title="currency.pairAbbrev">
          <div class="row mt-4">
            <div class="col">
              <router-link :to="{name: 'Currency',
                params: { abbrev: currency.baseAbbrev }}"
              >
                <b-button variant="primary" class="px-4">View</b-button>
              </router-link>
            </div>
          </div>
        </b-card>
      </b-col>
    </b-row>
  </app-template>
</template>


<script>
import AppTemplate from '@/components/patterns/AppTemplate';
import {
  currencyPairLatestRateHttpGetRequest,
  currencyWMAHttpGetRequest
} from '@/http/currencyRates';
import { getHttpRequest } from '@/http/apiRequestV2';
import { mapActions } from 'vuex';

const currencyPreview = {
  date: '',
  rate: '',
  twelveWMA: '',
  twentySixWMA: ''
};


export default {
  name: 'home',

  components: {
    AppTemplate
  },

  data() {
    return {
      currencyPairsLatestRates: [],
      AUDCurrency: currencyPreview,
      EURCurrency: currencyPreview,
      GBPCurrency: currencyPreview,
      JPYCurrency: currencyPreview,
      majorCurrencyAbbrevs: [],
    }
  },

  beforeMount() {
    this.uploadMajorCurrencyPairAbbrev();
  },

  methods: {
    uploadMajorCurrencyPairAbbrev() {
      const url = "major-currencypair-abbrevs";
      getHttpRequest(url)
        .then(res => {
          this.majorCurrencyAbbrevs = res;
        })
    },
  }
}
</script>
