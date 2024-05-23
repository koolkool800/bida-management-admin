import { Box, Button, TextField } from '@mui/material'
import { useRouter } from 'next/router'
import React, { useState } from 'react'
import RevenueChart from 'src/components/dashboard/RevenueChart'
import { API_URL } from 'src/constants/environment'
import { fetcher } from 'src/libs/axios'
import useSWR from 'swr'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import dayjs from 'dayjs'
import { ProductStatistic } from 'src/types/menu'

const DetailMenu = () => {
  const router = useRouter()
  const id = router.query.id
  const [queryParams, setQueryParams] = useState('start_date=2024-01-09&end_date=2024-12-12')
  const [startDate, setStartDate] = useState<dayjs.Dayjs | null>(dayjs('2024-01-09'))
  const [endDate, setEndDate] = useState<dayjs.Dayjs | null>(dayjs('2024-12-12'))
  const { data: product, mutate } = useSWR(
    [`${API_URL}/products/${id}/quantity-statistics`, queryParams],
    ([url, queryParams]) => fetcher(url, queryParams)
  )

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
      <Box sx={{ mt: 12 }}>
        <RevenueChart items={product?.data?.statistics as ProductStatistic[]} />
      </Box>
    </div>
  )
}

export default DetailMenu
