<template>
  <section>
    <b-form-select v-model="interval" :options="options" />
  </section>
</template>

<script>
const DEFAULT_INTERVAL = 1

export default {
  props: {
    value: {
      type: Number,
      required: true,
      default: DEFAULT_INTERVAL
    }
  },

  beforeMount() {
    if (!this.options.length) this.$store.dispatch('timeInterval/uploadTimeIntervals')

    this.setIntervalFromUrl()
  },

  computed: {
    options() {
      return this.$store.getters['timeInterval/selectOptions']
    },

    interval: {
      get() {
        return this.value
      },
      set(value) {
        this.$emit('input', value)
      }
    },
  },

  methods: {
    setIntervalFromUrl() {
      this.interval = this.$route.query.hasOwnProperty('interval')
        ? parseInt(this.$route.query.interval)
        : DEFAULT_INTERVAL
    }
  }
}
</script>

<style>

</style>