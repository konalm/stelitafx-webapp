const axios = require('axios')
const config = require('../config/index')


/**
 * Axios instance to be used for all Http requests to the API
 */
const httpInstance = axios.create({ baseURL: `${config.apiUrl}/`})


const request = method => async (url ) => {
  let response
  try {
    response = await httpInstance[method](url)
  } catch (e) {
    throw new Error(`${method} request to '${path}' failed: ${e}`)
  }

  return response.data
}


export const get = url => () => new Promise((resolve, reject) => 
  httpInstance.get(url)
    .then((response) => {
      resolve(response.data)
    })
    .catch((e) => {
      reject(e)
      throw new Error(`Get requestt to '${path}' failed: ${e}`)
    })
)


export const post = url => payload => async () => {
  let response
  try {
    response = await httpInstance.post(url, payload)
  } catch (e) {
    throw new Error(`Post request to '${path}' failed: ${e}`)
  }

  return response.data 
} 


export const put = url => payload => async () => {
  let response 
  try {
    response = await httpInstance.put(url, payload)
  } catch (e) {
    throw new Error(`Put request to '${path}' failed: ${e}`)
  }

  return response.data 
}
