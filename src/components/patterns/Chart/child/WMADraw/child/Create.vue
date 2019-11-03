<template>
  <b-modal :active="showModal">
    <b-card>
      <b-container>
        <b-row>
          <b-form-input v-model="description" placeholder="Description" />
        </b-row>

        <b-row class="mt-4">
          <b-button variant="primary"  v-on:click="create()">
            Create
          </b-button>
          <b-button variant="secondary" class="ml-2" v-on:click="cancel()">
            Cancel
          </b-button>
        </b-row>

        <b-row>
          <b-alert variant="danger" v-if="errorMessage" show class="mt-4 w-100">
            {{ errorMessage }}
          </b-alert>
        </b-row>
      </b-container>
    </b-card>
  </b-modal>
</template>

<script>
import { createChartingWMAOption } from '@/http/charting'

export default {
  props: {
    show: {
      type: Boolean,
      default: false,
      required: false
    }
  },

  data() {
    return {
      description: '',
      errorMessage: '',
      showModal: false
    }
  },

  mounted() {
    console.log('show modal ???')
  },

  methods: {
    create() {
      this.errorMessage = ''
      if (!this.description) {
        this.errorMessage = 'Description required!'
        return
      }

      createChartingWMAOption({description: this.description})
        .then(res => {
          this.description = ''
          this.$emit('hide')
        })
    },

    cancel() {
      this.description = ''
      this.$emit('hide')
    }
  },

  watch: {
    show(value) {
      console.log('watch show modal ?')
      console.log(value)

      this.showModal = value
    }
  }
}
</script>

