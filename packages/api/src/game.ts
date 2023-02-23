import {
  getLootboxsByAppId as getLootboxsByAppId1,
  getItemsByAppId as getItemsByAppId1,
  getAllGames,
  getGamesByAppId as getGamesByAppId1
} from 'shared/src/models'

export const getGames = getAllGames
export const getGamesByAppId = getGamesByAppId1
export const getLootboxsByAppId = getLootboxsByAppId1
export const getItemsByAppId = getItemsByAppId1
