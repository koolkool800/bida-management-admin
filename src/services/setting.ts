import axios from 'axios'
import toast from 'react-hot-toast'
import { API_URL } from 'src/constants/environment'
import { axiosInstance } from 'src/libs/axios'
import { Response } from 'src/types/response'

export const settingService = {
  create: async <T>(data: { type: string; price: number }): Promise<Response<T> | undefined> => {
    try {
      const response = await axiosInstance().post('setting-table', data)
      return response.data
    } catch (error) {
      console.error('errorrrrr')
      toast.error('Create setting failed', {
        position: 'top-right'
      })
    }
  },
  update: async <T>(data: { type?: string; price?: number; id: number }): Promise<Response<T> | undefined> => {
    try {
      const response = await axiosInstance().put(`setting-table/${data.id}`, data)
      return response.data
    } catch (error) {
      console.error(error)
      toast.error('Update setting failed', {
        position: 'top-right'
      })
    }
  },
  getList: async <T>(): Promise<Response<T> | null> => {
    try {
      const response = await axiosInstance().get('setting-table')
      return response.data
    } catch (error) {
      console.error(error)
      return null
    }
  }
}
