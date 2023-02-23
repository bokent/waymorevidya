import axios from 'axios'

export function getApiClient() {
  if (process.env.REACT_APP_BACKEND_API) {
    throw new Error('BACKEND_API env variable is not set')
  }

  return axios.create({
    baseURL: process.env.REACT_APP_BACKEND_API
  })
}
