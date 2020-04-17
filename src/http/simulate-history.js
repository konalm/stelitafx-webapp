import { get } from './httpRequest'


export const getSimulatedHistory = () => get('/simulate-history')

export const fetchCachedCalcPeriods = (fromDate, toDate, buffer) => get(
  `/cached-calc-periods?fromDate=${fromDate}&toDate=${toDate}&buffer=${buffer}`
)