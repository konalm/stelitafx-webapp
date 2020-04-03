import { getHttpRequest } from '@/http/apiRequestV2'
import { get } from './httpRequest'


export const getSimulatedHistory = (interval, currency) => 
  get(`/simulate-history/${interval}/currency/${currency}`)

export const fetchCachedCalcPeriods = get('/cached-calc-periods')