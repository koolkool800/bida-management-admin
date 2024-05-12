export type StatisticDashboard = {
  revenue: number
  total_employee: number
  total_invoice: number
  total_product: number
  recent_invoice: RecentInvoice[]
  top_revenue_table: RevenueTable[]
}

export type RevenueTable = {
  table_id: number
  table_name: number
  total_revenue: number
  setting_table_type: string
}

export type RecentInvoice = {
  customer_name?: string | null
  id: number
  total_price: number
  created_at: Date
}
