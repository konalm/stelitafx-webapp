import { getHttpRequest } from '@/http/apiRequestV2';

const protoAlgoTrades = {
  'EUR/USD': [],
  'JPY/USD': [],
  'GBP/USD': [],
  'AUD/USD': [],
}

const tradeStore = {
  namespaced: true,

  state: {
    trades: {
      protoNo1: protoAlgoTrades,
      protoNo2: protoAlgoTrades,
      protoNo3: protoAlgoTrades,
      protoNo4: protoAlgoTrades,
      protoNo5: protoAlgoTrades,
      protoNo6: protoAlgoTrades
    }
  },

  mutations: {
    setProtoCurrencyTrades(state, payload) {
      const protoProperty = `protoNo${payload.protoNo.toString()}`
      state.trades[protoProperty][payload.abbrev] = payload.trades;
    },
  },

  actions: {
    async uploadProtoTrades({ commit, rootGetters }, protoNo) {
      const dateFilter = rootGetters['dateFilter/filterDate'];

      let path = `/proto/${protoNo}/trades`
      if (dateFilter) path += `?date=${dateFilter}`

      let trades = []
      try {
        trades = await getHttpRequest(path)
      } catch (err) {
        throw new Error('Failed to get trades for proto');
      }

      return trades
    },

    uploadProtoCurrencyTrades({ commit, rootGetters }, data) {
      const dateFilter = rootGetters['dateFilter/filterDate'];

      let path = `/proto/${data.protoNo}/currency/${data.baseCurrency}`;
      if (dateFilter) path += `?date=${dateFilter}`

      getHttpRequest(path)
        .then(res => {
          commit('setProtoCurrencyTrades', {
            trades: res,
            protoNo: data.protoNo,
            abbrev: `${data.baseCurrency}/USD`
          });
        })
        .catch((err) => {
          throw new Error('Uploading trades for Prototype & currency');
        })
    },

    updateTradeToViewed(_, tradeId) {
      let path = `/trade/${tradeId}/viewed`
      getHttpRequest(path)
        .catch((err) => {
          throw new Error(`Failed to update trade to viewed: ${err}`)
        })
    }
  },

  getters: {
    protoCurrencyTrades: (state) => (protoNo, currency) => {
      if (protoNo === 0) return [];

      const propName = `protoNo${protoNo.toString()}`
      const abbrev = `${currency}/USD`

      return state.trades[propName][abbrev]
    },

    allTrades: (state) => {
      return state.trades
    }
  }
}

export default tradeStore
