import { get } from './httpRequest'


export const getSimulatedHistory = () => get('/simulate-history')

export const fetchCachedCalcPeriods = (fromDate, toDate, buffer, gran) => get(
  `/cached-calc-periods/${gran}?fromDate=${fromDate}&toDate=${toDate}&buffer=${buffer}`
)

export const fetchLiveCalcPeriods = (fromDate, toDate, buffer, gran) => get(
 `/cached-calc-periods/${gran}?fromDate=${fromDate}&toDate="${toDate}&buffer=${buffer}&fetchLive=true` 
)

export const fetchSimulatedPerformance = () => get ('/simulate-performance')

