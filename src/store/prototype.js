import { getHttpRequest } from '@/http/apiRequestV2'

const prototypeStore = {
  namespaced: true,

  actions: {
    async getPrototypes() {
      let response
      try {
        response = await getHttpRequest('protos')
      } catch (e) {
        console.error('Failed to get protots from API')
      }

      return response
    }
  }
}

export default prototypeStore;