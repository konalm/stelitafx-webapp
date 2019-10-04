<template>
  <section>
    <b-form-select v-model="interval" :options="options" />
  </section>
</template>

<script>
export default {
  props: {
    value: {
      type: Number,
      required: true,
      default: 1
    }
  },

  data() { return {} },

  beforeMount() {
    // if (this.$router.query.interval) this.interval = this.$router.query.interval

    if (!this.options.length) this.$store.dispatch('timeInterval/uploadTimeIntervals')

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

  watch: {
    // interval(value) {
    //   this.$router.push({query: {interval: value}})
    //   this.$emit('input', value)
    // },

    // value(value) {
    //   this.$emit('input', value)
    // }
  }
}
</script>

<style>

</style>