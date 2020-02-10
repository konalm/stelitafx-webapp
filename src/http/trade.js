import apiHttpRequest from './apiRequest.js';

export const getPrototypeIntervalTradeAnalyses = 
  async (prototypeNo, interval, dateTimeFilter) => 
{
  let response
  try {
    const url = `prototypes/${prototypeNo}/intervals/${interval}/trade-analyses?date=${dateTimeFilter}`
    response = await apiHttpRequest(url)
  } catch (e) {
    console.error(`Get prototype interval trade analyses failed: ${e}`)
    return
  }

  return response.data
}


export const getPrototypeIntervalTrades = async (prototypeNo, interval, dateFilter) => {
  console.log('get prototype interval trades')

  let path = `/protos/${prototypeNo}/intervals/${interval}/trades`
  if (dateFilter) path += `?date=${dateFilter}`

  let response
  try {
    response = await apiHttpRequest.get(path)
  } catch (e) {
    console.error(`Failed to get protoype ${prototypeNo} interval ${interval} trades`)
  }

  return response.data
}

export const getCurrencyTradesHttpRequest =
  async (algoProtoNo, currency, dateTimeFilter) =>
{
  const dateTimeFilterString = dateTimeFilter
    ? dateTimeFilter.toISOString()
    : '';
  const url = `algo/${algoProtoNo}/currency/${currency}?date=${dateTimeFilter}`

  let response;
  try {
    response = await apiHttpRequest.get(url);
  } catch (err) {
    console.error('get currency trade http request')
    return
  }
  
  return response.data;
}


export const getProtoIntervalCurrencyTrades = async (
  protoNo, 
  timeInterval, 
  currency, 
  filterDate
) => {
  let path = `/protos/${protoNo}/intervals/${timeInterval}/currency/${currency}/trades`
  if (filterDate) path += `?date=${filterDate}`

  let response
  try {
    response = await apiHttpRequest.get(path)
  } catch (e) {
    return console.error(`Failed to get proto interval currency trades ${e}`)
  }

  return response.data
}


export const tradeViewed = async (id) => {
  const url = `trade/${id}/viewed`

  let response
  try {
    response = await apiHttpRequest.get(url)
  } catch(e) {
    return console.error(`trade viewed http request failed: ${e}`)
  }

  return response.data
}


export const getWMADataForTrade = async (prototype, interval, currency, tradeUUID) => {
  const url = `/wma/${prototype}/interval/${interval}/${currency}/trade/${tradeUUID}`

  let response
  try {
    response = await apiHttpRequest.get(url)
  } catch (e) {
    return console.error(`failed to get WMA data for trade: ${tradeUUID}`)
  }

  return response.data
}

