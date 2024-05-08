// ** MUI Imports
import Grid from '@mui/material/Grid'

// ** Demo Components Imports
import {
  Box,
  Button,
  Card,
  CardHeader,
  InputAdornment,
  Modal,
  Tab,
  Tabs,
  TextField,
  Typography,
  styled
} from '@mui/material'

import { TableList } from 'src/components/table-management/TableList'
import { useEffect, useState } from 'react'
import { modalStyle } from 'src/configs/modal.config'
import CreateTable from 'src/components/table-management/Create'
import { TabContext, TabList, TabPanel } from '@mui/lab'
import LockOpenOutline from 'mdi-material-ui/LockOpenOutline'
import Lock from 'mdi-material-ui/Lock'
import { OrderList } from 'src/components/table-management/OrderList'
import useSWR from 'swr'
import { API_URL } from 'src/constants/environment'
import { fetcher } from 'src/libs/axios'
import Magnify from 'mdi-material-ui/Magnify'
import { BookingList } from 'src/components/table-management/BookingList'

const TabName = styled('span')(({ theme }) => ({
  lineHeight: 1.71,
  fontSize: '0.875rem',
  marginLeft: theme.spacing(2.4),
  [theme.breakpoints.down('md')]: {
    display: 'none'
  }
}))

const TableManagementPage = () => {
  const [open, setOpen] = useState(false)
  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)
  const [queryParams, setQueryParams] = useState('')
  const [search, setSearch] = useState('')

  const [value, setValue] = useState('all')
  const { data: listTable, mutate } = useSWR([`${API_URL}/tables`, queryParams], ([url, queryParams]) =>
    fetcher(url, queryParams)
  )
  const { data: listOrderTable, mutate: mutateOrder } = useSWR(`${API_URL}/orders`, fetcher)
  const { data: listTableBooking, mutate: mutateBooking } = useSWR(`${API_URL}/tables?is_available=false`, fetcher)

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue)
    setSearch('')
  }

  const handleSearch = () => {
    setQueryParams(`${queryParams}&q=${search}`)
  }

  return (
    <Grid container spacing={6}>
      <Grid item xs={12} style={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography variant='h5'>Table management</Typography>
        <Button variant='outlined' onClick={handleOpen}>
          Create
        </Button>
      </Grid>

      <Card sx={{ width: '100%', mt: '1rem' }}>
        <TabContext value={value}>
          <TabList
            onChange={handleChange}
            aria-label='account-settings tabs'
            sx={{ paddingBottom: '1.5rem' }}
            // borderBottom: theme => `1px solid ${theme.palette.divider}`
          >
            <Tab
              value='all'
              label={
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <LockOpenOutline />
                  <TabName>All table</TabName>
                </Box>
              }
            />

            {/* 
              TODO: Get list table just check in by is_available = false
            */}
            <Tab
              value='booking'
              label={
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Lock />
                  <TabName>Booking table</TabName>
                </Box>
              }
            />

            <Tab
              value='booked'
              label={
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Lock />
                  <TabName>Booked table</TabName>
                </Box>
              }
            />
          </TabList>

          <Box sx={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', paddingLeft: '0.5rem' }}>
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
              Search
            </Button>
          </Box>

          <TabPanel sx={{ p: 0 }} value='all'>
            <TableList
              items={listTable?.data?.data}
              mutate={mutate}
              mutateOrder={mutateOrder}
              mutateBooking={mutateBooking}
              setQueryParams={setQueryParams}
            />
          </TabPanel>
          <TabPanel sx={{ p: 0 }} value='booking'>
            <BookingList
              items={listTableBooking?.data?.data}
              setQueryParams={setQueryParams}
              mutate={mutateBooking}
              mutateList={mutate}
              mutateOrder={mutateOrder}
            />
          </TabPanel>

          <TabPanel sx={{ p: 0 }} value='booked'>
            <OrderList
              items={listOrderTable?.data?.data}
              mutate={mutateOrder}
              mutateList={mutate}
              mutateBooking={mutateBooking}
            />
          </TabPanel>
        </TabContext>
      </Card>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby='modal-modal-title'
        aria-describedby='modal-modal-description'
      >
        <CreateTable mutate={mutate} style={modalStyle} handleClose={handleClose} />
      </Modal>
    </Grid>
  )
}

export default TableManagementPage
