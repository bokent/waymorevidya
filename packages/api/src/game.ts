import {
  getLootboxsByAppId as getLootboxsByAppId1,
  getItemsByAppId as getItemsByAppId1,
  getAllGames,
  getGamesByAppId as getGamesByAppId1,
  getLootbox as getLootbox1,
  getLootboxItems as getLootboxItems1 
} from 'shared/src/models'

export const getGames = getAllGames
export const getGamesByAppId = getGamesByAppId1
export const getLootboxsByAppId = getLootboxsByAppId1
export const getLootbox = getLootbox1
export const getItemsByAppId = getItemsByAppId1
export const getLootboxItems = getLootboxItems1