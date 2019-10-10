import { getHttpRequest } from '@/http/apiRequestV2';


const timeIntervalStore = {
  namespaced: true,

  state: {
    selectOptions: [],
    interval: 1
  },

  mutations: {
    setSelectOptions(state, payload) {
      state.selectOptions = payload
    },
    setInterval(state, payload) {
      state.interval = payload
    }
  },

  actions: {
    updateInterval({commit}, payload) {
      commit('setInterval', payload)
    },

    uploadTimeIntervals({commit}) {
      getHttpRequest('intervals')
        .then(res => {
          const selectOptions = res.map((x) => ({ value: x, text: x }))
          commit('setSelectOptions', selectOptions)
        })
    },

    async getIntervals() {
      let response
      try {
        response = getHttpRequest('intervals')
      } catch (e) {
        console.error('Failed to get time intervals from API')
        return 
      }

      return response
    }
  },

  getters: {
    selectOptions: (state) => state.selectOptions,
    interval: (state) => state.interval
    
  }
}

export default timeIntervalStore