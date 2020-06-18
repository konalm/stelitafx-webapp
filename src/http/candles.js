import { getHttpRequest } from '@/http/apiRequestV2'
import { get } from './httpRequest'


const buildQueryParams = (queryParams) => {
  let queryParamsString = '?'
  for (let [k, v] of Object.entries(queryParams)) {
    if (!v) continue

    if (!queryParamsString) queryParams += '?'
    else queryParamsString += '&'

    queryParamsString += `${k}=${v}`
  }

  return queryParamsString
}

export const getCandles = async (gran, symbol, queryParams) => {
  const url = `/candles/${symbol}/grans/${gran}${buildQueryParams(queryParams)}`
  
  let response
  try {
    response = await getHttpRequest(url)
  } catch (e) {
    throw new Error(`Failed to fetch candle from Stelita api. ${e}`)
  }

  return response.sort((a,b) => new Date(a.date) - new Date(b.date))
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


export const fetchHeikienAshiCandles = async (symbol, interval, queryParams) => {
  let url = `heikien-ashi-candles/${symbol}/intervals/${interval}${buildQueryParams(queryParams)}`

  let response 
  try {
    response = await getHttpRequest(url)
  } catch (e) {
    console.log(e)
    throw new Error('Failed to get candle for trade')
  }

  return response.sort((a,b) => new Date(a.date) - new Date(b.date))
}


export const fetchWaves = async (symbol, gran, queryParams) => {
  const url = `waves/${symbol}/grans/${gran}${buildQueryParams(queryParams)}`

  let response
  try {
    response = await getHttpRequest(url)
  } catch (e) {
    throw new Error('Failed to get waves')
  }

  return response 
}


export const fetchVolume = async (symbol, gran, queryParams) => {
  const url = `volume/${symbol}/grans/${gran}${buildQueryParams(queryParams)}`

  let response 
  try {
    response = await getHttpRequest(url)
  } catch (e) {
    throw new Error('Failed to get volume')
  }

  return response 
}


export const fetchTrends = async (symbol, gran, queryParams) => {
  const url = `trends/${symbol}/grans/${gran}${buildQueryParams(queryParams)}`

  let response 
  try {
    response = await getHttpRequest(url)
  } catch (e) {
    throw new Error('Failed to fetch trends')
  }

  return response 
}