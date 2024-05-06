import axios, { AxiosInstance, InternalAxiosRequestConfig } from 'axios'
import { API_URL } from 'src/constants/environment'
import { USER, getUserLocal, localHandler } from 'src/utils/localStorage'

export const axiosInstance = () => {
  const headers = {
    'Content-Type': 'application/json'
  }

  const Axios: AxiosInstance = axios.create({
    baseURL: `${API_URL}`,
    headers
  })

  const token = getUserLocal()?.access_token

  Axios.interceptors.request.use(
    (config: InternalAxiosRequestConfig<any>) => {
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
      return config
    },
    error => {
      return Promise.reject(error)
    }
  )

  return Axios
}

export const fetcher = (url: string, queryParams?: string) => {
  console.log({ url, queryParams })
  return axiosInstance()
    .get(`${url}${queryParams ? `?${queryParams}` : ''}`)
    .then(res => res.data)
}
