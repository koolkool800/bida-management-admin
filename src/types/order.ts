export type Order = {
  id: number
  table_id: number
  user_id: number
  employeeName: string
  start_time: Date
  end_time?: Date
  tableName: string
  current_price: number
  total_price: number
}
