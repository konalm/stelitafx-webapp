import apiHttpRequest from './apiRequest.js';
import { getHttpRequest } from '@/http/apiRequestV2'


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


export const getPublishedAlgorithms = async () => {
  let response 
  try {
    response = await getHttpRequest('published-algorithms')
  } catch (e) {
    console.error('Failed to get published algorithms')
    return 
  }

  return response
}