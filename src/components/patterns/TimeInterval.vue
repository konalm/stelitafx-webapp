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
}
</script>

<style>

</style>