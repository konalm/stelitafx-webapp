const axios = require('axios');
const config = require('../config/index')

/**
 * Axios instance to be used for all Http requests to the API
 */
const httpInstance = axios.create({
  baseURL: `${config.apiUrl}/`,
  // timeout: 10000,
})


/**
 * Get HTTP request to Stelita FX API
 */
export const getHttpRequest = async (path) => {
  let response;

  try {
    response = await httpInstance.get(path);
  } catch (err) {
    console.log('CATCH !!!')
    console.log(err)
    throw new Error(`http get request to api for path >> ${path} \n ${err}`);
  }

  console.log('response -->')
  console.log(response)

  return response.data
}
