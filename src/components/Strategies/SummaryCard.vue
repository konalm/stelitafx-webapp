<template>
  <b-col cols="3" class="my-3">
    <b-card>
      <p class="lead">{{ strategySummary.name }}</p>
      <p><small>{{ strategySummary.description }}</small></p>

      <router-link :to="{ name: 'Strategy', params: { UUID: strategySummary.UUID }}">
        <b-button variant="primary" class="mt-4 w-100">View</b-button>
      </router-link>
    </b-card>
  </b-col>
</template>


<script>
export default {
  props: {
    strategySummary: {
      type: Object,
      required: true,
      default: () => {
        return {
          UUID: '',
          name: '',
          description: ''
        }
      }
    }
  },

  data() {
    return {}
  }
}
</script>

<style>

</style>