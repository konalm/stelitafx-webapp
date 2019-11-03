<template>
  <b-modal :active="true">
    <b-card>
      <p>WMA Draw Options</p>

      <b-form-select class="mt-4" v-model="selected" :options="chartingWMAOptions" />

      <b-button class="mt-4" variant="primary">New</b-button>
    </b-card>
  </b-modal>
</template>

<script>
import { getChartingWMAOptions } from '@/http/charting'

export default {
  data() {
    return {
      chartingWMAOptions: [],
      selected: ''
    }
  },

  beforeMount() {
    this.uploadChartingWMAOptions()
  },

  methods: {
    uploadChartingWMAOptions() {
      getChartingWMAOptions()
        .then(res => {
          this.chartingWMAOptions = res.map(x => ({
            text: x.description,
            value: x.uuid
          }))
          this.selected = this.chartingWMAOptions[0].value
        })
    }
  }
}
</script>

<style>

</style>