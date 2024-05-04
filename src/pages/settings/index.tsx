// ** MUI Imports
import { Button, Card, Modal, Typography } from '@mui/material'
import Grid from '@mui/material/Grid'
import { useState } from 'react'
import CreateSetting from 'src/components/settings/Create'
import { TableList } from 'src/components/settings/TableList'
import { modalStyle } from 'src/configs/modal.config'

const SettingsPage = () => {
  const [open, setOpen] = useState(false)
  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  return (
    <Grid container spacing={6}>
      <Grid item xs={12} style={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography variant='h5'>Setting management</Typography>
        <Button variant='outlined' onClick={handleOpen}>
          Create
        </Button>
      </Grid>

      <Grid item xs={12}>
        <Card>
          <TableList />
        </Card>
      </Grid>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby='modal-modal-title'
        aria-describedby='modal-modal-description'
      >
        <CreateSetting style={modalStyle} />
      </Modal>
    </Grid>
  )
}

export default SettingsPage
