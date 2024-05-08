import axios from 'axios'
import toast from 'react-hot-toast'
import { API_URL } from 'src/constants/environment'
import { axiosInstance } from 'src/libs/axios'
import { Response } from 'src/types/response'

export const orderService = {
  getList: async <T>(): Promise<Response<T> | null> => {
    try {
      const response = await axiosInstance().get('orders')
      return response.data
    } catch (error) {
      console.error(error)
      return null
    }
  },
  checkIn: async <T>(data: { table_id: number; user_id: number }): Promise<Response<T> | undefined> => {
    try {
      const response = await axiosInstance().post('orders/check-in', data)
      return response.data
    } catch (error: any) {
      toast.error(error?.response?.data?.message, {
        position: 'top-right'
      })
    }
  },
  checkOut: async <T>(data: { order_id: number }): Promise<Response<T> | undefined> => {
    try {
      const response = await axiosInstance().post('orders/check-out', data)
      return response.data
    } catch (error: any) {
      toast.error(error?.response?.data?.message, {
        position: 'top-right'
      })
    }
  }
}
