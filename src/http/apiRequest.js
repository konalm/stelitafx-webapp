const axios = require('axios');
const config = require('@/config')


/**
 * Axios instance to be used for all Http requests to the API
 */
module.exports = axios.create({
  baseURL: `${config.apiUrl}/`,
  timeout: 1000,
});
