import { getHttpRequest } from '@/http/apiRequestV2'


export const getAdxItemsForTrade = async (protoNo, interval, currency, tradeUUID, buffer) => {
  const url = `adx/${protoNo}/interval/${interval}/currency/${currency}/trade/${tradeUUID}?buffer=${buffer}`

  let response
  try {
    response = await getHttpRequest(url)
  } catch (e) {
    console.log(e)
    throw new Error('Failed to get adx items for trade')
  }

  return response
}
