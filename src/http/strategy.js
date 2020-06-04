import { get } from './httpRequest'


export const fetchStrategies = get('/strategies')

export const fetchStrategy = (UUID) => get(`strategies/${UUID}`)

export const fetchStrategyMasterAlgo = (strategyUUID, masterAlgoUUID) => get(
  `strategies/${strategyUUID}/master-algos/${masterAlgoUUID}`
)

export const fetchStats = (strategyUUID, interval, sinceDate) => get(
  `strategies/${strategyUUID}/intervals/${interval}/stats?sinceDate=${sinceDate}`
)