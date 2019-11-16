import { getHttpRequest } from '@/http/apiRequestV2'

export const getStochastics = async (abbrev, interval, count, offset) => {
  let response
  try {
    const path = `abbrev/${abbrev}/interval/${interval}/stochastic?count=${count}&offset=${offset}`
    response = await getHttpRequest(path)
  } catch (e) {
    throw new Error(`Faield to get stochastics ${e}`)
  }

  return response
}