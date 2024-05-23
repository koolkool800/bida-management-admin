export type User = {
  role: string
  name: string
  access_token: string
  expires_in: number
  id: number
}

export type Employee = {
  id: number
  name: string
  user_name: string
  phone: string
  address: string
}
