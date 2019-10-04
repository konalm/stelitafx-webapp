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
      protoNo51: protoAlgoTrades,
      protoNo6: protoAlgoTrades,
      protoNo7: protoAlgoTrades,
      protoNo71: protoAlgoTrades,
      protoNo72: protoAlgoTrades,
      protoNo73: protoAlgoTrades,
      protoNo74: protoAlgoTrades
    }
  },

  mutations: {
    setProtoCurrencyTrades(state, payload) {
      const protoProperty = `protoNo${payload.protoNo.toString()}`
      state.trades[protoProperty][payload.abbrev] = payload.trades;
    },
  },

  actions: {
    async uploadProtoTrades({ commit, rootGetters }, data) {
      const dateFilter = rootGetters['dateFilter/filterDate'];

      let path = `/protos/${data.protoNo}/intervals/${data.interval}/trades`
      console.log(path)
      if (dateFilter) path += `?date=${dateFilter}`

      let trades = []
      try {
        trades = await getHttpRequest(path)
      } catch (err) {
        throw new Error(err);
      }

      return trades
    },

    async uploadProtoIntervalCurrencyTrades ({ commit, rootGetters }, data) {
      console.log('upload proto interval currency trades')

      const dateFilter = rootGetters['dateFilter/filterDate'];
      const interval = rootGetters['timeInterval/interval'];

      let path = `/protos/${data.protoNo}/intervals/${interval}/currency/${data.baseCurrency}/trades`;
      console.log(`path --> ${path}`)
      if (dateFilter) path += `?date=${dateFilter}`

      let trades
      try {
        trades = await getHttpRequest(path)
      } catch (err) {
        console.error(`Failed to get proto interval currency trades: ${e}`)
      }

      return trades
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
