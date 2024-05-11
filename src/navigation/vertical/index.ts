// ** Icon imports
import HomeOutline from 'mdi-material-ui/HomeOutline'
import AccountCogOutline from 'mdi-material-ui/AccountCogOutline'
import Billiards from 'mdi-material-ui/Billiards'
import CogOutline from 'mdi-material-ui/CogOutline'
import Food from 'mdi-material-ui/Food'

// ** Type import
import { VerticalNavItemsType } from 'src/@core/layouts/types'

const navigation = (): VerticalNavItemsType => {
  return [
    {
      title: 'Trang chủ',
      icon: HomeOutline,
      path: '/'
    },
    {
      title: 'Trang chủ Ref',
      icon: HomeOutline,
      path: '/ref'
    },
    {
      title: 'Quản lý bàn',
      icon: Billiards,
      path: '/table-management'
    },
    {
      title: 'Hóa đơn',
      icon: Billiards,
      path: '/order'
    },
    {
      title: 'Quản lý nhân viên',
      icon: AccountCogOutline,
      path: '/employee-management'
    },
    {
      title: 'Cài đặt',
      icon: CogOutline,
      path: '/settings'
    },
    {
      title: 'Quản lý thực đơn',
      icon: Food,
      path: '/menu'
    },
    {
      title: 'carrd',
      icon: Billiards,
      path: '/cards'
    }
  ]
}

export default navigation
