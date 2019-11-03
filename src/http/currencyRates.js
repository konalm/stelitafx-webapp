import apiHttpRequest from './apiRequest.js';

export const getCurrencyRateSourceOptions = async () => {
  let response
  try {
    response = await apiHttpRequest.get('currency-rate-sources')
  } catch (e) {
    throw new Error(e)
  }

  return response.data.map(x => ({
    text: x,
    value: x
  }))
}

export const getMultiRates = async () => {
  let response;
  try {
    response = await apiHttpRequest.get('multi-rates')
  } catch (e) {
    throw new Error(e)
  }

  return response.data
}
/**
 * 
 */
export const getWMADatapointsFromDate = async (currency, interval, startDate) => {
  let response;
  try {
    response = await apiHttpRequest.get(`wma-data-points-from-date/${currency}/interval/${interval}/start-date/${startDate}`)
  } catch (e) {
    throw new Error(e)
  }

  return response.data
}


/**
 *
 */
export const currencyPairLatestRateHttpGetRequest = async () => {
  let response;
  try {
    response = await apiHttpRequest.get('currency-pairs-latest-rates');
  } catch (err) {
    throw new Error(err);
  }

  return response.data;
}


/**
 *
 */
export const currencyWMAHttpGetRequest = async (currency, wmaLength, historical) => {
  const url = `currency/${currency}/weighted_moving_average/${wmaLength}?historical=${historical}`

  let response;
  try {
    response = await apiHttpRequest.get(url);
  } catch (err) {
    throw new Error('currency WMA get http request');
  }

  return response.data;
}

export const getCurrencyRateHttpGetRequest = async (currency) => {
  const url = `currency/${currency}/rate`;

  let response;
  try {
    response = await apiHttpRequest.get(url);
  } catch {
    throw new Error('get currency rate http get request');
  }

  return response.data;
}


/**
 *
 */
export const currenciesRatesHttpGetRequest = async (currency, amount) => {
  const url = `currency/${currency}/rates/${amount}`

  let response;
  try {
    response = await apiHttpRequest.get(url);
  } catch {
    throw new Error('get currencies rates http request');
  }

  return response.data.map((row) => {
    return {
      abbrev: row.abbrev,
      exchangeRate: row.exchange_rate,
      date: new Date(row.date)
    }
  })
}


/**
 *
 */
export const currenciesWMADataPointsHttpGetRequest = async (currency, historicCount = 100) => {
  const url = `currency/${currency}/wma-data-points/${historicCount}`

  let response;
  try {
    response = await apiHttpRequest.get(url);
  } catch (err) {
    throw new Error('getting WMA data points');
  }

  return response.data;
}
