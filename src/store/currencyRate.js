import { getHttpRequest } from '@/http/apiRequestV2'

const currencyRateStore = {
  namespaced: true,
  
  actions: {
    async getCurrencyRateWmaData({}, payload) {
      const {currency, timeInterval, count, offset} = payload

      let response
      try {
        const path = `currency/${currency}/int/${timeInterval}/wma-data-points/${count}?offset=${offset}`
        response = await getHttpRequest(path)
      } catch (e) {
        console.error('Failed to get currency rate and WMA data')
        return
      }

      return response
    }
  }
}

export default currencyRateStore;