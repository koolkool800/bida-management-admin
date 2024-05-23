// ** MUI Imports
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'

// ** Demo Components Imports
import CardSupport from 'src/views/cards/CardSupport'
import CardStatistic from 'src/components/dashboard/CardStatistic'
import { Box, Paper } from '@mui/material'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardMedia from '@mui/material/CardMedia'
import IconButton from '@mui/material/IconButton'

import CurrencyUsd from 'mdi-material-ui/CurrencyUsd'
import FoodForkDrink from 'mdi-material-ui/FoodForkDrink'

import AccountMultiple from 'mdi-material-ui/AccountMultiple'

import Billiards from 'mdi-material-ui/Billiards'

import NotePlus from 'mdi-material-ui/NotePlus'
import useSWR from 'swr'
import { API_URL } from 'src/constants/environment'
import { fetcher } from 'src/libs/axios'
import { StatisticDashboard } from 'src/types/dashboard'
import { formatCurrency } from 'src/utils/price'
import DepositWithdraw from 'src/views/dashboard/DepositWithdraw'
import RecentOrders from 'src/components/dashboard/DepositWithdraw'
import WeeklyOverview from 'src/views/dashboard/WeeklyOverview'
import RevenueChart from 'src/components/dashboard/RevenueChart'
import Trophy from 'src/views/dashboard/Trophy'
import BestSeller from 'src/components/dashboard/BestSeller'
import StatisticsCard from 'src/components/dashboard/StatisticsCard'

const Dashboard = () => {
  const { data: statisticData, mutate } = useSWR(`${API_URL}/statistical`, fetcher)
  const statistic = statisticData?.data as StatisticDashboard

  return (
    <Grid container spacing={2} gap={12}>
      {/* <Grid container spacing={6}>
        {itemsStatistic.map((item, index) => (
          <Grid item xs={12} sm={6} md={12 / 5}>
            <CardStatistic icon={item.icon} title={item.title} value={item.value} />
          </Grid>
        ))}
      </Grid> */}
      <Grid container spacing={6}>
        <Grid item xs={12} md={4}>
          <BestSeller item={statistic?.top_revenue_table?.[0]} />
        </Grid>
        <Grid item xs={12} md={8}>
          <StatisticsCard />
        </Grid>
      </Grid>
      <Grid container spacing={2}>
        <Grid item xs={12} md={4}>
          <RecentOrders items={statistic?.recent_invoice} />
        </Grid>
        {/* <Grid item xs={6} md={8}>
          <Typography variant='h5' sx={{ marginBottom: 6 }}>
            Top bàn doanh thu cao nhất
          </Typography>

          <Paper>
            <Grid flexDirection={'column'} container gap={8}>
              {topTables.map((table, index) => (
                <Card sx={{ display: 'flex', padding: '10px' }}>
                  <CardMedia
                    component='img'
                    sx={{ width: 151 }}
                    image='https://scontent.fsgn8-4.fna.fbcdn.net/v/t1.15752-9/438270987_6858749857560668_8307698790179701267_n.png?_nc_cat=108&ccb=1-7&_nc_sid=5f2048&_nc_ohc=C0bzvp88GdoQ7kNvgHO4eyX&_nc_ht=scontent.fsgn8-4.fna&oh=03_Q7cD1QHdBre8BoS-eyLlY1i2Im-AuRLO3ThD-cOGlqUtret2UQ&oe=6662AEA2'
                    alt='Live from space album cover'
                  />
                  <Box
                    sx={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '0 20px'
                    }}
                  >
                    <Typography component='div' variant='h5'>
                      {table.name}
                    </Typography>
                    <Typography variant='h5' color='text.secondary' component='div'>
                      {table.revenue}
                    </Typography>
                  </Box>
                </Card>
              ))}
            </Grid>
          </Paper>
        </Grid> */}
        <Grid item xs={12} md={8}>
          <RevenueChart />
        </Grid>
      </Grid>
    </Grid>
  )
}

export default Dashboard
