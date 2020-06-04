<template>
  <app-template>
    <b-row>
      <b-col>
        <p class="lead">H1</p>
        <gran-wma-line-graph gran="H1" :symbol="symbol" />
      </b-col>

      <b-col>
        <p class="lead">H2</p>
        <gran-wma-line-graph gran="H2" :symbol="symbol" />
      </b-col>
    </b-row>

    <!-- <b-row>
      <b-col>
        <p class="lead">H4</p>
        <gran-wma-line-graph gran="H4" :symbol="symbol" />
      </b-col>

      <b-col>
        <p class="lead">H6</p>
        <gran-wma-line-graph gran="H6" :symbol="symbol" />
      </b-col>
    </b-row> -->

    <!-- <b-row>
      <b-col>
        <p class="lead">H12</p>
        <gran-wma-line-graph gran="H12" :symbol="symbol" />
      </b-col>
    </b-row> -->
  </app-template>
</template>


<script>
import AppTemplate from '@/components/patterns/AppTemplate'
import MonitorCurrency from './children/MonitorCurrency'
import { getHttpRequest } from '@/http/apiRequestV2';
import TimeInterval from '@/components/patterns/TimeInterval';
import GranWmaLineGraph from './children/GranWmaLineGraph';

export default {
  components: {
    AppTemplate,
    MonitorCurrency,
    TimeInterval,
    GranWmaLineGraph
  },

  data() {
    return {
      symbol: 'GBPCAD'
    }
  },
}
</script>
