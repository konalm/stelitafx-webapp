<template>
  <section>
    <b-form-select class="mt-3" v-model="filter" :options="options" required />
  </section>
</template>


<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  data() {
    return {
      modalActive: false
    }
  },

  computed: {
    ...mapGetters({
      storeFilter: 'dateFilter/filter',
      options: 'dateFilter/options',
      filterDate: 'dateFilter/filterDate'
    }),

    filter: {
      get: function () {
        return this.storeFilter
      },
      set: function (newFilter) {
        this.newFilter(newFilter);
      }
    },
  },

  methods: {
    ...mapActions({
      newFilter: 'dateFilter/updateFilter'
    }),

    toggleModalActive() {
      this.modalActive = !this.modalActive
    }
  }
}
</script>

<style lang='scss' scoped>

li {
  cursor: pointer;
  padding: 10px;

  &:hover  {
    background: #007bff;
  }
}

select {
  cursor: pointer;
}
</style>
