import apiHttpRequest from './apiRequest.js';

export const currencyPairLatestRateHttpGetRequest = async () => {
  let response;
  try {
    response = await apiHttpRequest.get('currency-pairs-latest-rates');
  } catch (err) {
    throw new Error(err);
  }

  return response.data;
}

export const currencyWMAHttpGetRequest = async (currency, wmaLength) => {
  const url = `currency/${currency}/weighted_moving_average/${wmaLength}`

  let response;
  try {
    response = await apiHttpRequest.get(url);
  } catch (err) {
    throw new Error('currency WMA get http request');
  }

  return response.data;
}
