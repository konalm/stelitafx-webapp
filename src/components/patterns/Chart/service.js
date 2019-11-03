import { numberToWMAStringValue } from '@/services/utils'

/**
 * Get indices of transactions that meet open and close conditions of algorithm
 */
export const getTransactionIndices = (dataPoints, algorithm) => {
  const dps = [...dataPoints];
  dps.sort((a, b) => {
    return new Date(a.date) - new Date(b.date)
  })

  const open = []
  const close = []
  dps.forEach((dp, i) => {
    if (i === 0) return
    
    const prevDp = dps[i - 1]
    const openConditionsMet = triggerOpenConditionsMet(algorithm, dp, prevDp)
    const closeConditionsMet = triggerCloseConditionsMet(algorithm, dp, prevDp)
    
    if (openConditionsMet) open.push(i)
    if (closeConditionsMet) close.push(i)
  })

  return {open, close}
}


const getShortAndLongWMAValues = (dataPoint, prevDataPoint, parameters) => {
  const shortWMAString = numberToWMAStringValue(parameters.shortWMA)
  const longWMAString = numberToWMAStringValue(parameters.longWMA)

  const shortWMA = dataPoint[shortWMAString]
  const prevShortWMA = prevDataPoint[shortWMAString]

  const longWMA = dataPoint[longWMAString]
  const prevLongWMA = prevDataPoint[longWMAString]

  return {
    current: {shortWMA, longWMA},
    previous: {
      shortWMA: prevShortWMA,
      longWMA: prevLongWMA
    }
  }
}


/**
 * Short WMA previously below long WMA, short WMA now crossed over the long WMA
 */
const shortWMACrossedOverLongWMA = (WMAs) => {
  const current = WMAs.current
  const prev = WMAs.previous

  return (prev.shortWMA <= prev.longWMA) && (current.shortWMA > current.longWMA)
}


/**
 * Short WMA previously above long WMA, short WMA now crossed under the long WMA
 */
const shortWMACrossedUnderLongWMA = (WMAs) => {
  const current = WMAs.current
  const prev = WMAs.previous

  return (prev.shortWMA >= prev.longWMA) && (current.shortWMA < current.longWMA)
}


const triggerOpenConditionsMet = (algorithm, dataPoint, prevDataPoint) => {
  let conditionsMet = true

  const indicators = algorithm.hasOwnProperty('openTriggers')
    ? algorithm.openTriggers.map(x => x.indicator)
    : []

  indicators.forEach((indicator, i) => {
    const params = algorithm.openTriggers[i].parameters

    if (indicator === 'WMA') {
      const dataPointWMAs = getShortAndLongWMAValues(dataPoint, prevDataPoint, params)
      if (!shortWMACrossedOverLongWMA(dataPointWMAs)) conditionsMet = false
    }
  })

  return conditionsMet
}


const triggerCloseConditionsMet = (algorithm, dataPoint, prevDataPoint) => {
  let conditionsMet = true 

  const indicators = algorithm.hasOwnProperty('closeTriggers')
    ? algorithm.closeTriggers.map(x => x.indicator)
    : []

  indicators.forEach((indicator, i) => {
    const params = algorithm.closeTriggers[i].parameters

    if (indicator === 'WMA') {
      const dataPointWMAs = getShortAndLongWMAValues(dataPoint, prevDataPoint, params)
      if (!shortWMACrossedUnderLongWMA(dataPointWMAs)) conditionsMet = false
    }
  })

  return conditionsMet
}
