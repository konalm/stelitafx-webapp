<template>
  <section>
    <b-form-select v-model="abbrev" :options="options" />
  </section>
</template>

<script>
const abbrevs = [ 'GBP', 'EUR', 'AUD' ]

export default {
  props: {
    value: {
      type: String,
      required: true,
      default: 'GBP'
    }
  },

  data() { 
    return { } 
  },

  computed: {
    options() {
      return abbrevs.map((x) => ({ value: x, text: x }))
    },

    abbrev: {
      get() {
        return this.value
      },

      set(value) {
        this.$emit('input', value)
      }
    }
  }
}
</script>