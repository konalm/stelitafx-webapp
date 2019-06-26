import apiHttpRequest from './apiRequest.js';

/**
 *
 */
export const getCurrencyTradesHttpRequest = async (algoProtoNo, currency) => {
  const url = `algo/${algoProtoNo}/currency/${currency}`

  let response;
  try {
    response = await apiHttpRequest.get(url);
  } catch (err) {
    throw new Error('get currency trade http request')
  }

  return response.data;
}
