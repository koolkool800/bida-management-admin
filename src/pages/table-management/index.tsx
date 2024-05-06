// ** MUI Imports
import Grid from '@mui/material/Grid'

// ** Demo Components Imports
import { Box, Button, Card, CardHeader, Modal, Tab, Tabs, Typography, styled } from '@mui/material'

import { TableList } from 'src/components/table-management/TableList'
import { useEffect, useState } from 'react'
import { modalStyle } from 'src/configs/modal.config'
import CreateTable from 'src/components/table-management/Create'
import { QueryClient, dehydrate, useQuery } from '@tanstack/react-query'
import { TabContext, TabList, TabPanel } from '@mui/lab'
import TabSecurity from 'src/views/account-settings/TabSecurity'
import AccountOutline from 'mdi-material-ui/AccountOutline'
import LockOpenOutline from 'mdi-material-ui/LockOpenOutline'
import Lock from 'mdi-material-ui/Lock'
import { OrderList } from 'src/components/table-management/OrderList'
import useSWR from 'swr'
import { API_URL } from 'src/constants/environment'
import { fetcher } from 'src/libs/axios'

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

  const [value, setValue] = useState('all')
  const { data: listTable, mutate } = useSWR([`${API_URL}/tables`, queryParams], ([url, queryParams]) =>
    fetcher(url, queryParams)
  )
  const { data: listOrderTable, mutate: mutateOrder } = useSWR(`${API_URL}/orders`, fetcher)

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue)
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
            sx={{ borderBottom: theme => `1px solid ${theme.palette.divider}`, paddingBottom: '1rem' }}
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

          <TabPanel sx={{ p: 0 }} value='all'>
            <TableList
              items={listTable?.data?.data}
              mutate={mutate}
              mutateOrder={mutateOrder}
              setQueryParams={setQueryParams}
            />
          </TabPanel>
          <TabPanel sx={{ p: 0 }} value='booked'>
            <OrderList items={listOrderTable?.data?.data} mutate={mutateOrder} mutateList={mutate} />
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
