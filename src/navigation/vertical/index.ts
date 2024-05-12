// ** Icon imports
import HomeOutline from 'mdi-material-ui/HomeOutline'
import AccountCogOutline from 'mdi-material-ui/AccountCogOutline'
import Billiards from 'mdi-material-ui/Billiards'
import CogOutline from 'mdi-material-ui/CogOutline'
import Food from 'mdi-material-ui/Food'
import NotePlus from 'mdi-material-ui/NotePlus'

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
      title: 'Quản lý bàn',
      icon: Billiards,
      path: '/table-management'
    },
    {
      title: 'Hóa đơn',
      icon: NotePlus,
      path: '/order'
    },
    {
      title: 'Quản lý nhân viên',
      icon: AccountCogOutline,
      path: '/employee-management'
    },

    {
      title: 'Quản lý thực đơn',
      icon: Food,
      path: '/menu'
    },
    {
      title: 'Cài đặt',
      icon: CogOutline,
      path: '/settings'
    }
  ]
}

export default navigation
