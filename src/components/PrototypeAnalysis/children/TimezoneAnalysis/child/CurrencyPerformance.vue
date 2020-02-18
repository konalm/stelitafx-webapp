<template>
  <div>
    <b-row>
      <b-col>
        <p class="lead mt-2"> {{ abbrev }} </p>
      </b-col>
    </b-row>
      
    <time-zone-analysis-item :name="timezoneName" :beginHour="beginHour"
      :endHour="endHour"
      :trades="abbrevTrades"
    />
  </div>
</template>

<script>
import TimeZoneAnalysisItem from './TimeZoneAnalysisItem.vue'

export default {
  components: {
    TimeZoneAnalysisItem,
  },

  props: {
    abbrev: {
      type: String,
      required: true
    },

    timezoneName: {
      type: String,
      required: true
    },

    trades: {
      type: Array,
      required: true
    },

    beginHour: {
      type: Number,
      required: true
    },

    endHour: {
      type: Number,
      required: true
    }
  },

  computed: {
    abbrevTrades() {
      return this.trades.filter((x) => x.abbrev === this.abbrev)
    }
  }

}
</script>

<style>

</style>