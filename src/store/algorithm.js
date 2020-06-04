import { getPublishedAlgorithms } from '@/http/algos'


const algorithmStore = {
  namespaced: true,

  state: {
    publishedAlgorithms: [],
    algoStats: []
  },

  getters: {
    isPublished: (state) => (payload) => {
      const foundAlgorithm = state.publishedAlgorithms.findIndex((x) => 
        x.prototypeNo === payload.prototypeNo 
          && x.timeInterval === payload.timeInterval
      )

      return foundAlgorithm >= 0
    },

    masterAlgoStats: (state) => (UUID) => {
      return state.algoStats.filter((x) => x.masterAlgoUUID === UUID)
    }
  },

  mutations: {
    setPublishedAlgorithms(state, publishedAlgorithms) {
      state.publishedAlgorithms = publishedAlgorithms
    },

    updateAlgoStat(state, payload) {
      state.algoStats.splice(payload.index,1, payload.algo)
    },

    addAlgo(state, payload) {
      state.algoStats.push(payload)
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
    },

    addMasterAlgoStatItem({ state, commit }, algo) {
      const existingAlgoIndex = state.algoStats.findIndex((x) => x.protoNo === algo.protoNo)
      if (existingAlgoIndex > -1) {
        commit('updateAlgoStat', ({algo, index: existingAlgoIndex}))
        return
      }

      commit('addAlgo', algo)
    }
  }
}

export default algorithmStore