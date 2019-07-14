const axios = require('axios');
const config = require('@/config')

/**
 * Axios instance to be used for all Http requests to the API
 */
const httpInstance = axios.create({
  baseURL: `${config.apiUrl}/`,
  timeout: 1000,
})


/**
 * Get HTTP request to Stelita FX API
 */
export const getHttpRequest = async (path) => {
  let response;

  try {
    response = await httpInstance.get(path);
  } catch (err) {
    throw new Error(`http get request to api for path >> ${path} \n ${err}`);
  }

  return response.data
}
