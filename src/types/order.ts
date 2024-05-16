import { OrderDetail } from 'src/types/menu'

export type Order = {
  id: number
  table_id: number
  user_id: number
  employeeName: string
  start_time: Date
  end_time?: Date
  tableName: string
  current_price: number
  total_price?: number
  total_product_price?: number
  table_name: string
  setting_table_type: string
  customer_name?: string
  customer_phone?: string
  order_detail: OrderDetail[]
}
