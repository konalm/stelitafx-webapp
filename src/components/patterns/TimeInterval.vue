<template>
  <section>
    <b-form-select v-model="interval" :options="options" />
  </section>
</template>

<script>
export default {
  data() { return {} },

  beforeMount() {
    this.$store.dispatch('timeInterval/uploadTimeIntervals')
  },

  computed: {
    options() {
      return this.$store.getters['timeInterval/selectOptions']
    },

    interval: {
      get() {
        return this.$store.getters['timeInterval/interval']
      },
      set(newValue) {
        this.$store.dispatch('timeInterval/updateInterval', newValue)
      }
    }
  },
}
</script>

<style>

</style>