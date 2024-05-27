// ** React Imports
import { ReactElement } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import Avatar from '@mui/material/Avatar'
import CardHeader from '@mui/material/CardHeader'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'

// ** Icons Imports
import TrendingUp from 'mdi-material-ui/TrendingUp'
import CurrencyUsd from 'mdi-material-ui/CurrencyUsd'
import DotsVertical from 'mdi-material-ui/DotsVertical'
import CellphoneLink from 'mdi-material-ui/CellphoneLink'
import AccountOutline from 'mdi-material-ui/AccountOutline'

// ** Types
import { ThemeColor } from 'src/@core/layouts/types'
import { OverridableComponent } from '@mui/material/OverridableComponent'
import { SvgIconTypeMap } from '@mui/material'
import NotePlus from 'mdi-material-ui/NotePlus'
import Note from 'mdi-material-ui/Note'
import { formatCurrency } from 'src/utils/price'
import useSWR from 'swr'
import { API_URL } from 'src/constants/environment'
import { fetcher } from 'src/libs/axios'
import { StatisticDashboard } from 'src/types/dashboard'
import FoodForkDrink from 'mdi-material-ui/FoodForkDrink'
import Billiards from 'mdi-material-ui/Billiards'
import { format } from 'path'

interface DataType {
  stats: any
  title: string
  color: ThemeColor
  icon: ReactElement
}

const StatisticsCardDetail = ({ item }: { item: { total_price_sum: number; total_product_price_sum: number } }) => {
  const salesData: DataType[] = [
    {
      stats: formatCurrency(item?.total_product_price_sum),
      title: 'Tiền đồ ăn',
      color: 'primary',
      icon: <Note sx={{ fontSize: '1.75rem' }} />
    },
    {
      stats: formatCurrency(item?.total_price_sum),
      color: 'warning',
      title: 'Bàn',
      icon: <Billiards sx={{ fontSize: '1.75rem' }} />
    },
    {
      stats: formatCurrency(item?.total_price_sum + item?.total_product_price_sum),
      color: 'info',
      title: 'Tổng doanh thu',
      icon: <CurrencyUsd sx={{ fontSize: '1.75rem' }} />
    }
  ]

  const renderStats = () => {
    return salesData.map((item: DataType, index: number) => (
      <Grid item xs={12} sm={3} key={index}>
        <Box key={index} sx={{ display: 'flex', alignItems: 'center' }}>
          <Avatar
            variant='rounded'
            sx={{
              mr: 3,
              width: 44,
              height: 44,
              boxShadow: 3,
              color: 'common.white',
              backgroundColor: `${item.color}.main`
            }}
          >
            {item.icon}
          </Avatar>
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Typography variant='caption'>{item.title}</Typography>
            <Typography variant='h6'>{item.stats}</Typography>
          </Box>
        </Box>
      </Grid>
    ))
  }

  return (
    <Card>
      <CardHeader
        title='Thông số chi tiết'
        action={
          <IconButton size='small' aria-label='settings' className='card-more-options' sx={{ color: 'text.secondary' }}>
            <DotsVertical />
          </IconButton>
        }
        subheader={
          <Typography variant='body2'>
            <Box component='span' sx={{ fontWeight: 600, color: 'text.primary' }}>
              Tổng doanh thu tăng 48.5%
            </Box>{' '}
            😎 trong tháng
          </Typography>
        }
        titleTypographyProps={{
          sx: {
            mb: 2.5,
            lineHeight: '2rem !important',
            letterSpacing: '0.15px !important'
          }
        }}
      />
      <CardContent sx={{ pt: theme => `${theme.spacing(3)} !important` }}>
        <Grid container spacing={[5, 0]}>
          {renderStats()}
        </Grid>
      </CardContent>
    </Card>
  )
}

export default StatisticsCardDetail
