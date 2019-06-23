import apiHttpRequest from './apiRequest.js';


/**
 *
 */
export const algosHttpGetRequest = async () => {
  const url = `protos`;

  let response;
  try {
    response = await apiHttpRequest.get(url);
  } catch (err) {
    throw new Error('get algos http request');
  }

  return response.data;
}
