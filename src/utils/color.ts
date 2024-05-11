import { MenuType } from 'src/types/menu'

export const getColorByTableType = (type: string) => {
  let color = ''
  switch (type) {
    case 'NORMAL':
      color = 'info'
      break
    case 'VIP':
      color = 'success'
      break
    case 'MEDIUM':
      color = 'primary'
      break
    case 'SUPER VIP':
      color = 'warning'
      break
    default:
      color = 'error'
      break
  }

  return color
}

export const getColorByMenuType = (type: string) => {
  let color = ''
  switch (type) {
    case MenuType.DRINK:
      color = 'error'
      break
    default:
      color = 'success'
      break
  }

  return color
}
