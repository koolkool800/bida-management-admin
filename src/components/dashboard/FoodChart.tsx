import { Box, Button, Card, Grid, TextField } from '@mui/material'
import { useRouter } from 'next/router'
import React, { useState } from 'react'
import { API_URL } from 'src/constants/environment'
import { fetcher } from 'src/libs/axios'
import useSWR from 'swr'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import dayjs from 'dayjs'
import { ProductStatistic } from 'src/types/menu'
import StatisticsCardDetail from 'src/components/dashboard/StatisticCardDetail'
import RevenueChartDetail from 'src/components/dashboard/RevenueChartDetail'

interface IChart {
  date?: string
  total_price_sum: number
  total_product_price_sum: number
}

const FootChart = () => {
  const router = useRouter()
  const id = router.query.id
  const [queryParams, setQueryParams] = useState('start_date=2024-01-09&end_date=2024-12-12')
  const [startDate, setStartDate] = useState<dayjs.Dayjs | null>(dayjs('2024-01-09'))
  const [endDate, setEndDate] = useState<dayjs.Dayjs | null>(dayjs('2024-12-12'))
  const { data: statisticDashboard } = useSWR([`${API_URL}/statistical/revenue`, queryParams], ([url, queryParams]) =>
    fetcher(url, queryParams)
  )

  const statistics = statisticDashboard?.data as IChart[]
  const statisticDetail =
    statistics?.length &&
    (statistics?.reduce((prevValue, currentValue) => {
      return {
        total_price_sum: prevValue.total_price_sum + currentValue.total_price_sum,
        total_product_price_sum: prevValue.total_product_price_sum + currentValue.total_product_price_sum
      }
    }) as any)

  const onSearch = async () => {
    const formattedStartDate = startDate?.format('YYYY-MM-DD')
    const formattedEndDate = endDate?.format('YYYY-MM-DD')
    setQueryParams(`?start_date=${formattedStartDate}&end_date=${formattedEndDate}`)
  }
  return (
    <div>
      <div>Thống kê chi tiết</div>
      <Box sx={{ display: 'flex', gap: '20px', pt: '20px' }}>
        <DatePicker label='Ngày bắt đầu' value={startDate} onChange={newValue => setStartDate(newValue)} />
        <DatePicker label='Ngày kết thúc' value={endDate} onChange={newValue => setEndDate(newValue)} />
        <Button variant='outlined' sx={{ width: '150px' }} onClick={() => onSearch()}>
          Tìm kiếm
        </Button>
      </Box>

      <Grid container spacing={6} p={4}>
        <Grid item xs={12} md={12}>
          <Card>
            <StatisticsCardDetail item={statisticDetail} />
          </Card>
        </Grid>
      </Grid>

      <Box sx={{ mt: 12 }}>
        <RevenueChartDetail items={statistics as any[]} />
      </Box>
    </div>
  )
}

export default FootChart
