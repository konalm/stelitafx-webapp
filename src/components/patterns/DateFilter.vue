<template>
  <section>
    <b-form-select v-model="filterV2" :options="optionsV2" required />    
  </section>
</template>


<script>
import { mapGetters, mapActions } from 'vuex'
import { beginningOfDay, getDaysFromToday, getDateFromMonthsAgo } from '@/services/utils'

export default {
  props: {
    value: {
      type: [Date, String],
      required: true
    }
  },

  // lets map options to their value :)

  data() {
    return {
      options: [
        'Today',
        'Last 3 days',
        'Week',
        'Two weeks',
        'One month',
        'Three months',
        'All time'
      ],

      optionsV2: [
        { value: beginningOfDay(0), text: 'Today' },
        { value: beginningOfDay(2), text: 'Last 3 days' },
        { value: beginningOfDay(6), text: 'Week' },
        { value: beginningOfDay(13), text: 'Two weeks' },
        { value: getDateFromMonthsAgo(1), text: 'One month' },
        { value: getDateFromMonthsAgo(3), text: 'Three months' },
        { value: '', text: 'All time' }
      ]
    }
  },

  computed: {
    x() {
      console.log(`beginning of day ... ${beginningOfDay(0)}`)
      return this.value === this.filterV2
    },

    filterV2: {
      get: function () {
        return this.value
      },
      set: function (value) {
        this.$emit('input', value)
      }
    },

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
