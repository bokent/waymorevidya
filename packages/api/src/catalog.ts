import axios, { Axios } from 'axios'

const axiosInstance = axios.create({
  baseURL: `https://api.steamapis.com`
})

export async function getSteamApp(appId: any): Promise<any> {
  const response = await axiosInstance.get(
    `/market/app/${appId}?api_key=${process.env['STEAM_API_KEY']}`
  )
  console.debug('response:', response.data)
  return response.data
}
