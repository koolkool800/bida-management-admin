'use client'
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
import NewTableList from 'src/components/table-management/NewTableList'

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

  const { data: listTableBooking, mutate: mutate } = useSWR(`${API_URL}/tables`, fetcher)

  return (
    <Grid container spacing={6}>
      <Grid item xs={12} style={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography variant='h5'>Danh sách bàn billiard</Typography>
        <Button variant='outlined' onClick={handleOpen}>
          Tạo mới
        </Button>
      </Grid>

      <Grid item xs={12}>
        <NewTableList items={listTableBooking?.data?.data} mutate={mutate} />
      </Grid>
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
