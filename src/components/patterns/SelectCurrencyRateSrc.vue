<template>
  <b-form-select v-model="currencyRateSrc" :options="options" />
</template>

<script>
import { getCurrencyRateSourceOptions } from '@/http/currencyRates';

export default {
  props: {
    value: {
      type: String,
      required: false
    }
  },

  data() {
    return {
      currencyRateSrc: '',
      options: []
    }
  },

  beforeMount() {
    this.uploadCurrencyRateSrcOptions()
  },

  methods: {
    uploadCurrencyRateSrcOptions() {
      getCurrencyRateSourceOptions()
        .then(res => {
          this.options = res
          this.currencyRateSrc = res[0].value
        })
    }
  },

  watch: {
    value(value) { 
      this.currencyRateSrc = value 
    },

    currencyRateSrc(value) { 
      this.$emit('input', value) 
    }
  }
}
</script>

