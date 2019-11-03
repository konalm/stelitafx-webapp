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
export const getHttpRequest = async (path, params = {}) => {

  let response;
  try {
    response = await httpInstance.get(path, { params });
  } catch (err) {
    console.error(`http get request to api for path >> ${path}`);
    throw new Error(err)
  }

  return response.data
}


export const postHttpRequest = async (payload) => {
  let response 
  try {
    response = await httpInstance.post(path, payload)
  } catch (e) {
    console.error(`Http post requst failed for ${path} posting ${payload}`)
    throw new Error(e)
  }

  return response.data
}


export const putHttpRequest = async (path, payload) => {
  let response 
  try {
    response = await httpInstance.put(path, payload)
  } catch (e) {
    console.error(`Http put request failed for ${path} putting ${payload}`)
    throw new Error(e)
  }

  return response.data
}