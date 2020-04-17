import { getHttpRequest } from '@/http/apiRequestV2'
import { get } from './httpRequest'

export const getCandles = async (interval, currency, count, offset) => {
  const url = `/candle/${interval}/currency/${currency}/count/${count}?offset=${offset}`
  
  let response
  try {
    response = await getHttpRequest(url)
  } catch (e) {
    throw new Error(`Failed to fetch candle from Stelita api. ${e}`)
  }

  return response.data.sort((a,b) => new Date(a.date) - new Date(b.date))
}


export const getCandlesForTrade = async (protoNo, interval, currency, tradeUUID, buffer) => {
  const url = `candle/${protoNo}/interval/${interval}/currency/${currency}/trade/${tradeUUID}?buffer=${buffer}`

  let response 
  try {
    response = await getHttpRequest(url)
  } catch (e) {
    console.log(e)
    throw new Error('Failed to get candle for trade')
  }

  return response.sort((a,b) => new Date(a.date) - new Date(b.date))
}


export const fetchCandlePatternSimulator = (abbrev, sinceDate) => get(
  `candle-pattern-simulator/${abbrev}?sinceDate=${sinceDate}`
)