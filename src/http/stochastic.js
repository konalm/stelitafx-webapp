import { getHttpRequest } from '@/http/apiRequestV2'


export const getStochastics = async (abbrev, interval, count, offset) => {
  let response
  try {
    const path = `abbrev/${abbrev}/inte
    rval/${interval}/stochastic?count=${count}&offset=${offset}`
    response = await getHttpRequest(path)
  } catch (e) {
    throw new Error(`Faield to get stochastics ${e}`)
  }

  return response
}


export const getStochasticsForTrade = async (prototypeNumber, interval, currency, tradeUUID) => {
  console.log('get stochastics for trade')
  console.log(prototypeNumber)
  console.log(interval)
  console.log(currency)
  console.log(tradeUUID)
  let response 
  try {
    const path = `stochastics/${prototypeNumber}/interval/${interval}/currency/${currency}/trade/${tradeUUID}`
    response = await getHttpRequest(path)
  } catch (e) {
    console.error(`Failed to get stochastics for trade ${tradeUUID}`)
    return
  }

  console.log('response >>>>>')
  console.log(response)

  return response
}