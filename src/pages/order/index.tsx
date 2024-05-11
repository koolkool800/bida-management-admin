import React, { useState } from 'react'
import {
  Box,
  Button,
  Card,
  CardHeader,
  Grid,
  InputAdornment,
  Modal,
  Tab,
  Tabs,
  TextField,
  Typography,
  styled
} from '@mui/material'
import { Magnify } from 'mdi-material-ui'
import { OrderList } from 'src/components/order/OrderList'
import { API_URL } from 'src/constants/environment'
import useSWR from 'swr'
import { fetcher } from 'src/libs/axios'

const OrderPage = () => {
  const [search, setSearch] = useState('')
  const [queryParams, setQueryParams] = useState('')

  const handleSearch = () => {
    setQueryParams(`${queryParams}&q=${search}`)
  }

  const { data: listOrderTable, mutate: mutateOrder } = useSWR(`${API_URL}/orders`, fetcher)

  return (
    <Grid container spacing={6}>
      <Grid item xs={12} style={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography variant='h5'>Quản lý bàn</Typography>
      </Grid>

      <Card sx={{ width: '100%', mt: '1rem' }}>
        <Box sx={{ display: 'flex', gap: '1rem', marginBlock: '1.5rem', paddingLeft: '0.5rem' }}>
          <TextField
            size='small'
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 4 } }}
            onChange={e => setSearch(e.target.value)}
            value={search}
            InputProps={{
              startAdornment: (
                <InputAdornment position='start'>
                  <Magnify fontSize='small' />
                </InputAdornment>
              )
            }}
          />

          <Button onClick={() => handleSearch()} variant='contained'>
            Tìm kiếm
          </Button>
        </Box>

        <OrderList items={listOrderTable?.data?.data} mutate={mutateOrder} />
      </Card>
    </Grid>
  )
}

export default OrderPage
