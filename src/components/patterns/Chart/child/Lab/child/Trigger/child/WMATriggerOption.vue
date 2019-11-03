<template>
  <section class="mt-2">
    <b-form-select v-model="shortWMA" :options="shortWMAOptions" class="slim" />
    <b-form-select v-model="longWMA" :options="longWMAOptions" class="slim mt-1" />
  </section>
  
</template>

<script>
export default {
  props: {
    value: {
      type: Object,
      required: true
    }
  },

  data() {
    return {
      shortWMA: null,
      longWMA: null,
      options: [
        { text: 'rate', value: 0 },
        { text: '5 WMA', value: 5 },
        { text: '12 WMA', value: 12 },
        { text: '15 WMA', value: 15 },
        { text: '36 WMA', value: 36 },
        { text: '200 WMA', value: 200 }
      ],

      get shortWMAOptions() {
        return [{ text: '--- select short WMA --- ', value: null}].concat(this.options)
      },

      get longWMAOptions() {
        return [{ text: '--- select long WMA --- ' , value: null}].concat(this.options)
      },

      get triggerParameters() {
        return {
          shortWMA: this.shortWMA,
          longWMA: this.longWMA
        }
      }
    }
  },

  watch: {
    value(value) {
      if (value.hasOwnProperty('shortWMA')) this.shortWMA = value.shortWMA
      if (value.hasOwnProperty('longWMA')) this.longWMA = value.longWMA
    },

    triggerParameters(value) {
      this.$emit('input', value)
    }
  }
}
</script>

<style>

</style>