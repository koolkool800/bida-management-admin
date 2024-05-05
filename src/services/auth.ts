//create class auth contains methods for login and register
import axios from 'axios'
import { API_URL } from 'src/constants/environment'
import { axiosInstance } from 'src/libs/axios'
import { Response } from 'src/types/response'

export const authService = {
  login: async <T>(data: { user_name: string; password: string }): Promise<Response<T> | null> => {
    try {
      const response = await axiosInstance().post('/auth/login', data)
      return response.data
    } catch (error) {
      console.error(error)
      return null
    }
  }
}
