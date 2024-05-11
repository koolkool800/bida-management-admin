export type Product = {
  id: number
  name: string
  price: number
  type: MenuType
  image_url: string
}

export type OrderDetail = {
  id: number
  menu_id: number
  menu_name: string
  order_id: number
  quantity: number
  price: number
}

export enum MenuType {
  FOOD = 'FOOD',
  DRINK = 'DRINK'
}

export const menuItems: Product[] = [
  {
    id: 1,
    name: 'Hamburger',
    price: 50000,
    type: MenuType.FOOD,
    image_url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR2wMpLe1d6uCyhxAnkVoOyoxBx-EwpQEbsYR37u_IMcw&s'
  },
  {
    id: 2,
    name: 'French Fries',
    price: 25000,
    type: MenuType.FOOD,
    image_url: 'https://www.recipetineats.com/wp-content/uploads/2022/09/Crispy-Fries_8.jpg'
  },
  {
    id: 3,
    name: 'Coca Cola',
    price: 12000,
    type: MenuType.DRINK,
    image_url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQNMHBXyRJtVOhIdhgyWqKMdV6pI2A1_uP7aNlRKHaXNA&s'
  },
  {
    id: 4,
    name: 'Orange Juice',
    price: 15000,
    type: MenuType.DRINK,
    image_url: 'https://upload.wikimedia.org/wikipedia/commons/0/05/Orangejuice.jpg'
  }
]

export const orderMenus: OrderDetail[] = [
  {
    id: 1,
    menu_id: 1,
    order_id: 1,
    quantity: 2,
    price: 30000,
    menu_name: 'Hamburger'
  },
  {
    id: 2,
    menu_id: 3,
    order_id: 1,
    quantity: 1,
    price: 35000,
    menu_name: 'Coca Cola'
  },
  {
    id: 3,
    menu_id: 2,
    order_id: 2,
    quantity: 1,
    price: 10000,
    menu_name: 'French Fries'
  },
  {
    id: 4,
    menu_id: 4,
    order_id: 2,
    quantity: 3,
    price: 90000,
    menu_name: 'Orange Juice'
  }
]
