import apiHttpRequest from './apiRequest.js';


export const getCurrencyTradesHttpRequest =
  async (algoProtoNo, currency, dateTimeFilter) =>
{
  const dateTimeFilterString = dateTimeFilter
    ? dateTimeFilter.toISOString()
    : '';
  const url = `algo/${algoProtoNo}/currency/${currency}?date=${dateTimeFilterString}`

  let response;
  try {
    response = await apiHttpRequest.get(url);
  } catch (err) {
    throw new Error('get currency trade http request')
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
    console.error(`Failed to get proto interval currency trades ${e}`)
    return
  }

  return response.data
}


export const tradeViewed = async (id) => {
  const url = `trade/${id}/viewed`

  let response
  try {
    response = await apiHttpRequest.get(url)
  } catch(e) {
    console.error(`trade viewed http request failed: ${e}`)
    return
  }

  return response.data
}