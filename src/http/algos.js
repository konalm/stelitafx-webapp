import apiHttpRequest from './apiRequest.js';
import { getHttpRequest } from '@/http/apiRequestV2'
import { get } from './httpRequest'


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


export const fetchAlgoStats = (id, interval) => get(`algorithm/${id}/intervals/${interval}/stats`)