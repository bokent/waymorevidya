import axios, { Axios } from 'axios'
import { Game, gameModel } from 'shared/src/models'
const axiosInstance = axios.create({
  baseURL: `https://api.steamapis.com`
})

export async function getSteamApp(appId: any): Promise<any> {
  const response = await axiosInstance.get(
    `/market/app/${appId}?api_key=${process.env['STEAM_API_KEY']}`
  )
  console.debug('response:', response.data)
  await gameModel.replaceOne({appId: appId}, {
    "appId": appId,
    "background": response.data.background,
    "blockchain": "Solana",
    "desc": response.data.short_description,
    "isPublished": false,
    "mainImage": response.data.header_image,
    "mccAddress": "",
    "name": response.data.name
  }, {"upsert": true})
  return response.data
}