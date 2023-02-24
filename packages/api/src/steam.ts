import axios from 'axios'
import { gameModel } from 'shared/src/models'
import { getEnvVariable } from './config'

const axiosInstance = axios.create({
  baseURL: `https://api.steamapis.com`
})

export async function getSteamApp(appId: any, makePage?: boolean): Promise<any> {
  const response = await axiosInstance.get(
    `/market/app/${appId}?api_key=${getEnvVariable('STEAM_API_KEY')}`
  )
  console.debug('get steam app response:', response.data)
  if (makePage) {
    await gameModel.replaceOne(
      { appId: appId },
      {
        appId: appId,
        background: response.data.background,
        blockchain: 'solana',
        desc: response.data.short_description,
        isPublished: false,
        mainImage: response.data.header_image,
        mccAddress: '',
        name: response.data.name
      },
      { upsert: true }
    )
  }
  return response.data
}
