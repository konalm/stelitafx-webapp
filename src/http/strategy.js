import { get } from './httpRequest'


export const fetchStrategies = get('/strategies')

export const fetchStrategy = (UUID) => get(`strategies/${UUID}`)

export const fetchStrategyMasterAlgo = (strategyUUID, masterAlgoUUID) => get(
  `strategies/${strategyUUID}/master-algos/${masterAlgoUUID}`
)