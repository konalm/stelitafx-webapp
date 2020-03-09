import { getHttpRequest } from '@/http/apiRequestV2'

export const getMacdItemsForTrade = async (protoNo, interval, currency, tradeUUID) => {
  const url = `macd/${protoNo}/interval/${interval}/currency/${currency}/trade/${tradeUUID}`

  let response
  try {
    response = await getHttpRequest(url)
  } catch (e) {
    console.log(e)
    throw new Error('Failed to get macd items for trade')
  }

  return response
}