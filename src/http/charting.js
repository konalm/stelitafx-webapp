import { getHttpRequest, postHttpRequest, putHttpRequest } from '@/http/apiRequestV2'

const URL = 'charting-wma-options'

export const getChartingWMAOptions = async () => {
  let response
  try {
    response = await getHttpRequest(URL)
  } catch (e) {
    console.error('Failed to get charting wma options')
    return false
  }

  return response
}

export const createChartingWMAOption = async (data) => {
  let response
  try {
    response = await postHttpRequest(URL, data)
  } catch (e) {
    console.error('Failing to create charting wma option')
    return false
  }

  return response
}


export const getChartingWMAOptionItem = async (uuid) => {
  let response 
  try {
    response = await getHttpRequest(`${URL}/${uuid}`)
  } catch (e) {
    console.error('Failed to get charting WMA option item')
    return false 
  }

  return {
    uuid: response.uuid,
    description: response.description,
    optionsJSON: response.options_json,
    date: response.date
  }
}

export const updateChartingWMAOptionItem = async (uuid, data) => {
  let response 
  try {
    response = await putHttpRequest(`${URL}/${uuid}`, data)
  } catch (e) {
    console.error('Failed to put charting WMA option item')
    return false
  }

  return response
}