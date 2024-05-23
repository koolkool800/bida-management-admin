export type Product = {
  id: number
  name: string
  price: number
  type: MenuType
  image_url: string
  current_quantity: number
}

export type ProductStatistic = {
  date: string
  total_import_quantity: number
  total_export_quantity: number
}

export type OrderDetail = {
  product_name: string
  quantity: number
  product_price: number
  product_type: MenuType
  image_url: string
  created_at: Date
}

export enum MenuType {
  FOOD = 'FOOD',
  DRINK = 'DRINK'
}
