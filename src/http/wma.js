import { get } from './httpRequest'

export const fetchSymbolGranWMA = (symbol, gran, startDate) => get(
  `/wma-data-points-from-date/${symbol}/interval/${gran}/start-date/${startDate}`
)