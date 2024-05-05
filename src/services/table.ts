import axios from 'axios'
import toast from 'react-hot-toast'
import { API_URL } from 'src/constants/environment'
import { axiosInstance } from 'src/libs/axios'
import { Response } from 'src/types/response'

export const tableService = {
  create: async <T>(data: { name: string; setting_table_id: number }): Promise<Response<T> | undefined> => {
    try {
      const response = await axiosInstance().post('tables', data)
      return response.data
    } catch (error) {
      toast.error('Create table failed', {
        position: 'top-right'
      })
    }
  },
  delete: async <T>(id: number): Promise<Response<T> | undefined> => {
    try {
      const response = await axiosInstance().delete(`tables/${id}`)
      return response.data
    } catch (error) {
      toast.error('Delete table failed', {
        position: 'top-right'
      })
    }
  },
  checkIn: async <T>(data: { table_id: number; user_id: number }): Promise<Response<T> | undefined> => {
    try {
      const response = await axiosInstance().post('orders/check-in', data)
      return response.data
    } catch (error) {
      toast.error('Check in failed', {
        position: 'top-right'
      })
    }
  }
  // checkOut: async <T>(data: { table_id: number; user_id: number }): Promise<Response<T> | undefined> => {
  //   try {
  //     const response = await axiosInstance().post('checkout', data)
  //     return response.data
  //   } catch (error) {
  //     toast.error('Check out failed', {
  //       position: 'top-right'
  //     })
  //   }
  // }
}
