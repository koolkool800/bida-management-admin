// ** MUI Imports
import { Box, Button, Card, Modal, Typography } from '@mui/material'
import Grid from '@mui/material/Grid'
import { useState } from 'react'
import CreateEmployee from 'src/components/employee-management/Create'
import { TableList } from 'src/components/employee-management/TableList'
import { modalStyle } from 'src/configs/modal.config'
import { API_URL } from 'src/constants/environment'
import { fetcher } from 'src/libs/axios'
import useSWR from 'swr'

const EmployeeManagementPage = () => {
  const [open, setOpen] = useState(false)
  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)
  const { data: listEmployee, error, isLoading, mutate } = useSWR(`${API_URL}/employees`, fetcher)

  return (
    <Grid container spacing={6}>
      <Grid item xs={12} style={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography variant='h5'>Quản lý nhân viên</Typography>
        <Button variant='outlined' onClick={handleOpen}>
          Tạo mới
        </Button>
      </Grid>

      <Grid item xs={12}>
        <Card>
          <TableList items={listEmployee?.data?.data} mutate={mutate} />
        </Card>
      </Grid>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby='modal-modal-title'
        aria-describedby='modal-modal-description'
      >
        <CreateEmployee style={modalStyle} handleClose={handleClose} mutate={mutate} />
      </Modal>
    </Grid>
  )
}

export default EmployeeManagementPage
