<template>
  <section>
    <!-- {{ filter }} -->
    <b-form-select v-model="filter" :options="options" required />
  </section>
</template>


<script>
import { mapGetters, mapActions } from 'vuex'
import { beginningOfDay, getDaysFromToday } from '@/services/utils'

export default {
  props: {
    value: {
      type: [Date, String],
      required: true
    }
  },

  data() {
    return {
      options: [
        'Today',
        'Last 3 days',
        'Week',
        'All time'
      ]
    }
  },

  computed: {
    filter: {
      get: function () { 
        if (!this.value) return this.options[3]

        switch(getDaysFromToday(this.value)) {
          case 0:
            return this.options[0]
          case 2:
            return this.options[1]
          case 6:
            return this.options[2]
          default:
            return this.options[3]
        }
      },
      set: function (value) { 
        const options = this.options;

        let date
        switch(value) {
          case options[0]:
            date = beginningOfDay(0)
            break
          case options[1]:
            date = beginningOfDay(2)
            break
          case options[2]:
            date = beginningOfDay(6)
            break
          default:
            date = ''
        }

        this.$emit('input', date) 
      }
    },
  },
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
