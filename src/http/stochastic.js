import { getHttpRequest } from '@/http/apiRequestV2'


export const getStochastics = async (abbrev, interval, count, offset) => {
  let response
  try {
    const path = `abbrev/${abbrev}/interval/${interval}/stochastic?count=${count}&offset=${offset}`
    response = await getHttpRequest(path)
  } catch (e) {
    throw new Error(`Failed to get stochastics ${e}`)
  }

  return response
}


export const getStochasticsForTrade = async (
  prototypeNumber, 
  interval, 
  currency, 
  tradeUUID,
  buffer
) => {
  let response 
  try {
    const path = `stochastics/${prototypeNumber}/interval/${interval}/currency/${currency}/trade/${tradeUUID}?buffer=${buffer}`
    response = await getHttpRequest(path)
  } catch (e) {
    return console.error(`Failed to get stochastics for trade ${tradeUUID}`)
  }

  return response
}