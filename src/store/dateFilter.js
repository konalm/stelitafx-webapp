const utils = require('../services/utils');

module.exports = {
  namespaced: true,

  state: {
    filter: 'Today',
    options: [
      'Today',
      'Last 3 days',
      'Week',
      'All time'
    ]
  },

  mutations: {
    setFilter (state, newFilter) {
      state.filter = newFilter;
    }
  },

  actions: {
    updateFilter({ commit }, newFilter) {
      commit('setFilter', newFilter);
    },
  },

  getters: {
    filter: (state) => {
      return state.filter
    },
    options: (state) => {
      return state.options
    },
    filterDate: (state) => {
      const options = state.options

      let date
      switch(state.filter) {
        case options[0]:
          date = utils.beginningOfDay(0)
          break
        case options[1]:
          date = utils.beginningOfDay(2)
          break
        case options[2]:
          date = utils.beginningOfDay(6)
          break
        default:
          date = null
      }

      return date;
    }
  }
};
