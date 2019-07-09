import apiHttpRequest from './apiRequest.js';

/**
 *
 */
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
