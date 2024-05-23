import axios from 'axios'
import toast from 'react-hot-toast'
import { API_URL } from 'src/constants/environment'
import { axiosInstance } from 'src/libs/axios'
import { MenuType } from 'src/types/menu'
import { Response } from 'src/types/response'

export const menuService = {
  create: async <T>(data: {
    name: string
    type: MenuType
    price: number
    image_url: string
  }): Promise<Response<T> | undefined> => {
    try {
      const response = await axiosInstance().post('products', data)
      return response.data
    } catch (error: any) {
      console.error(error)
      toast.error(error?.response?.data?.message, {
        position: 'top-right'
      })
    }
  },
  import: async <T>(data: any): Promise<Response<T> | undefined> => {
    try {
      const response = await axiosInstance().post('products/imports', data)
      return response.data
    } catch (error: any) {
      console.error(error)
      toast.error(error?.response?.data?.message, {
        position: 'top-right'
      })
    }
  },

  getList: async <T>(): Promise<Response<T> | null> => {
    try {
      const response = await axiosInstance().get('products')
      return response.data
    } catch (error) {
      console.error(error)
      return null
    }
  },
  delete: async <T>(id: number): Promise<Response<T> | undefined> => {
    try {
      const response = await axiosInstance().delete(`products/${id}`)
      return response.data
    } catch (error: any) {
      toast.error(error?.response?.data?.message, {
        position: 'top-right'
      })
    }
  }
}
