import { getHttpRequest } from '@/http/apiRequestV2'

export const getSimulatedHistory = async (interval, currency, date) => {
  const url = `/simulate-history/${interval}/currency/${currency}?since=${date}`

  console.log(url)

  let response
  try {
    response = await getHttpRequest(url)
  } catch (e) {
    console.log(e)
    throw new Error('Failed to get simulated history')
  }

  return response
}
