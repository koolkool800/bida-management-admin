import axios from 'axios'
import toast from 'react-hot-toast'
import { API_URL } from 'src/constants/environment'
import { axiosInstance } from 'src/libs/axios'
import { Response } from 'src/types/response'

interface IAddProduct {
  product_id: number
  quantity: number
  price: number
}
export const orderService = {
  getList: async <T>(): Promise<Response<T> | null> => {
    try {
      const response = await axiosInstance().get('orders')
      return response.data
    } catch (error: any) {
      toast.error(error?.response?.data?.message, {
        position: 'top-right'
      })
      return null
    }
  },
  getDetail: async <T>(id: number): Promise<Response<T> | undefined> => {
    try {
      const response = await axiosInstance().get(`orders/${id}`)
      return response.data
    } catch (error: any) {
      toast.error(error?.response?.data?.message, {
        position: 'top-right'
      })
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
  checkOut: async <T>(data: { order_id: number; customer_name?: string }): Promise<Response<T> | undefined> => {
    try {
      const response = await axiosInstance().post('orders/check-out', data)
      return response.data
    } catch (error: any) {
      toast.error(error?.response?.data?.message, {
        position: 'top-right'
      })
    }
  },
  updateProduct: async <T>(data: { order_id: number; products: IAddProduct[] }): Promise<Response<T> | undefined> => {
    try {
      const response = await axiosInstance().post(`orders/${data.order_id}/products`, { products: data.products })
      return response.data
    } catch (error: any) {
      toast.error(error?.response?.data?.message, {
        position: 'top-right'
      })
    }
  },
  getTotalPrice: async <T>(data: { order_id: number }): Promise<Response<T> | undefined> => {
    try {
      const response = await axiosInstance().get(`orders/${data.order_id}/total-price`)
      return response.data
    } catch (error: any) {
      toast.error(error?.response?.data?.message, {
        position: 'top-right'
      })
    }
  }
}
