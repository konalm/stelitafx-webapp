import { getPublishedAlgorithms } from '@/http/algos'


const algorithmStore = {
  namespaced: true,

  state: {
    publishedAlgorithms: []
  },

  getters: {
    isPublished: (state) => (payload) => {
      const foundAlgorithm = state.publishedAlgorithms.findIndex((x) => 
        x.prototypeNo === payload.prototypeNo 
          && x.timeInterval === payload.timeInterval
      )

      return foundAlgorithm >= 0
    }
  },

  mutations: {
    setPublishedAlgorithms(state, publishedAlgorithms) {
      state.publishedAlgorithms = publishedAlgorithms
    }
  },

  actions: {
    async uploadPublishedAlgorithms({ commit }) {
      let publishedAlgorithms
      try {
        publishedAlgorithms = await getPublishedAlgorithms()
      } catch (e) { 
        throw new Error('Failed to upload published algorithms to the store')
      }

      commit('setPublishedAlgorithms', publishedAlgorithms)
    }
  }
}

export default algorithmStore