<template>
  <b-col cols="3" class="my-3">
    <b-card>
      <p class="lead"> {{ masterAlgoSummary.description }} </p>

      <router-link :to="{}">
        <b-button variant="primary" class="mt-4 w-100">View</b-button>
      </router-link>
    </b-card>
  </b-col>
</template>


<script>
export default {
  props: {
    masterAlgoSummary: {
      type: Object,
      required: true,
      default: () => {
        return {
          UUID: '',
          description: ''
        }
      }
    },

    strategyUUID: {
      type: String,
      required: true
    }
  }
}
</script>
