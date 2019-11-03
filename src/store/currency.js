import { getHttpRequest } from '@/http/apiRequestV2'

const currencyStore = {
  namespaced: true,

  actions: {
    async getCurrencyAbbrevs() {
      let response
      try {
        const url = "major-currencypair-abbrevs";
        response = await getHttpRequest(url)
      } catch (e) {
        console.error('Failed to get major currency pairs from API')
      }

      return response
    }
  }
}

export default currencyStore;