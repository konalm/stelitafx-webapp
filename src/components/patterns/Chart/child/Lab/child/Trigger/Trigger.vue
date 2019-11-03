<template>
  <section class="mt-2 bg-info p-2 rounded position-relative">
    <b-form-select v-model="indicator" :options="indicatorOptions" class="slim" />

    <b-button class="bg-danger remove-trigger" v-on:click="remove()">
      <i class="fa fa-times" aria-hidden="true"></i>
    </b-button>

    <wma-indicator-option v-model="indicatorParameters" v-if="indicator === 'WMA'" />
  </section>
</template>

<script>
import wmaIndicatorOption from './child/WMATriggerOption'

export default {
  components: {
    wmaIndicatorOption
  },

  props: {
    index: {
      type: Number,
      required: true
    },

    value: {
      type: Object,
      required: true
    }
  },

  data() {
    return {
      indicator: '',
      indicatorParameters: {},
      indicatorOptions: [
        { text: '-- select indicator --', value: '' },
        { text: 'WMA', value: 'WMA' }
      ]
    }
  },

  beforeMount() {
    this.indicator = this.indicatorOptions[0].value
  },

  computed: {
    trigger() {
      return  {
        indicator: this.indicator,
        parameters: this.indicatorParameters
      }
    },
  },

  methods: {
    remove() {
      this.$emit('remove', this.index)
    }
  },

  watch: {
    trigger(value) {
      this.$emit('input', value)
    }
  }
  
}
</script>

<style>
.remove-trigger {
  font-size: 12px;
  padding: 1px 3px;
  position: absolute;
  top: -10px;
  right: -5px;
}
</style>