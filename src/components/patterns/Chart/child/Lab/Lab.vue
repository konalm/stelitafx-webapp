<template>
  <b-card>
    <p class="border-bottom">Lab</p>
    
    <b-row class="mt-2">
      <b-col>
        <p> Open triggers </p>
        <b-button v-on:click="addOpenTrigger()" class="slim"> 
          <i class="fas fa-plus"></i> 
        </b-button>

        <trigger v-for="(trigger, index) in openTriggers" :key="index"
          v-model="openTriggers[index]"
          :index="index"
          v-on:remove="removeOpenTrigger"
        />
      </b-col>

      <b-col>
        <p> Close triggers </p>
        <b-button v-on:click="addCloseTrigger()" class="slim"> 
          <i class="fas fa-plus"></i>
        </b-button>

        <trigger v-for="(trigger, index) in closeTriggers" :key="index"
          v-model="closeTriggers[index]"
          :index="index" 
          v-on:remove="removeCloseTrigger"
        />
      </b-col>
    </b-row>
  </b-card>
</template>

<script>
import Trigger from './child/Trigger';

export default {
  components: {
    Trigger
  },

  props: {
    value: {
      type: Object,
      required: false
    }
  },

  data() {
    return {
      openTriggers: [],
      closeTriggers: []
    }
  },

  computed: {
    algorithmn() {
      return {
        openTriggers: this.openTriggers,
        closeTriggers: this.closeTriggers
      }
    }
  },

  methods: {
    addOpenTrigger() {
      this.openTriggers.push({})
    },

    addCloseTrigger() {
      this.closeTriggers.push({})
    },

    removeOpenTrigger(index) {
      this.openTriggers.splice(index, 1)
    },

    removeCloseTrigger(index) {
      this.closeTriggers.splice(index, 1)
    }
  },

  watch: {
    algorithmn(value) {
      this.$emit('input', value)
    },

    value(value) {
      if (value.hasOwnProperty('openTriggers')) this.openTriggers = value.openTriggers
      if (value.hasOwnProperty('closeTriggers')) this.closeTriggers = value.closeTriggers
    }
  }
}
</script>

<style>
.card {
  width: 100%;
}

</style>