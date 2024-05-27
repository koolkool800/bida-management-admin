// ** MUI Imports
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'

// ** Demo Components Imports
import CardSupport from 'src/views/cards/CardSupport'
import CardStatistic from 'src/components/dashboard/CardStatistic'
import { Box, Paper, styled } from '@mui/material'
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
import HomeDashboardRevenue from 'src/components/dashboard/HomeDashboard'
import MuiTab, { TabProps } from '@mui/material/Tab'
import TabList from '@mui/lab/TabList'
import TabPanel from '@mui/lab/TabPanel'
import TabContext from '@mui/lab/TabContext'
import { SyntheticEvent, useState } from 'react'
import AccountOutline from 'mdi-material-ui/AccountOutline'
import LockOpenOutline from 'mdi-material-ui/LockOpenOutline'
import InformationOutline from 'mdi-material-ui/InformationOutline'
import TabSecurity from 'src/views/account-settings/TabSecurity'
import FootChart from 'src/components/dashboard/FoodChart'

const Tab = styled(MuiTab)<TabProps>(({ theme }) => ({
  [theme.breakpoints.down('md')]: {
    minWidth: 100
  },
  [theme.breakpoints.down('sm')]: {
    minWidth: 67
  }
}))

const TabName = styled('span')(({ theme }) => ({
  lineHeight: 1.71,
  fontSize: '0.875rem',
  marginLeft: theme.spacing(2.4),
  [theme.breakpoints.down('md')]: {
    display: 'none'
  }
}))

const Dashboard = () => {
  const { data: statisticData, mutate } = useSWR(`${API_URL}/statistical`, fetcher)
  const statistic = statisticData?.data as StatisticDashboard
  const [value, setValue] = useState<string>('account')

  const handleChange = (event: SyntheticEvent, newValue: string) => {
    setValue(newValue)
  }

  return (
    <Card>
      <TabContext value={value}>
        <TabList
          onChange={handleChange}
          aria-label='account-settings tabs'
          sx={{ borderBottom: theme => `1px solid ${theme.palette.divider}` }}
        >
          <Tab
            value='account'
            label={
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                {/* <AccountOutline /> */}
                <TabName>Tất cả</TabName>
              </Box>
            }
          />
          <Tab
            value='security'
            label={
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                {/* <LockOpenOutline /> */}
                <TabName>Thực đơn</TabName>
              </Box>
            }
          />
        </TabList>

        <TabPanel sx={{ pb: 12 }} value='account'>
          {/* <TabAccount /> */}
          <Grid container spacing={2} gap={12}>
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

              <Grid item xs={12} md={8}>
                <HomeDashboardRevenue />
              </Grid>
            </Grid>
          </Grid>
        </TabPanel>
        <TabPanel sx={{ p: '20px' }} value='security'>
          <Grid container spacing={2} gap={12}></Grid>
          <FootChart />
        </TabPanel>
      </TabContext>
    </Card>
  )
}

export default Dashboard
