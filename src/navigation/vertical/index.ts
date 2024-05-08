// ** Icon imports
import Login from 'mdi-material-ui/Login'
import Table from 'mdi-material-ui/Table'
import CubeOutline from 'mdi-material-ui/CubeOutline'
import HomeOutline from 'mdi-material-ui/HomeOutline'
import FormatLetterCase from 'mdi-material-ui/FormatLetterCase'
import AccountCogOutline from 'mdi-material-ui/AccountCogOutline'
import CreditCardOutline from 'mdi-material-ui/CreditCardOutline'
import AccountPlusOutline from 'mdi-material-ui/AccountPlusOutline'
import AlertCircleOutline from 'mdi-material-ui/AlertCircleOutline'
import GoogleCirclesExtended from 'mdi-material-ui/GoogleCirclesExtended'
import Billiards from 'mdi-material-ui/Billiards'
import CogOutline from 'mdi-material-ui/CogOutline'

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
      title: 'Quản lý nhân viên',
      icon: AccountCogOutline,
      path: '/employee-management'
    },
    {
      title: 'Cài đặt',
      icon: CogOutline,
      path: '/settings'
    }
  ]
}

export default navigation
