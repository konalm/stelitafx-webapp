import apiHttpRequest from './apiRequest.js';

/**
 *
 */
export const getCurrencyTradesHttpRequest = async (algoId, currency) => {
  const url = `algo/${algoId}/currency/${currency}`

  let response;
  try {
    response = await apiHttpRequest.get(url);
  } catch (err) {
    throw new Error('get currency trade http request')
  }

  return response.data;
}
