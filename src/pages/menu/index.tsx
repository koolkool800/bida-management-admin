// ** MUI Imports
import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  FormControl,
  InputAdornment,
  InputLabel,
  MenuItem,
  Modal,
  Paper,
  Select,
  TextField,
  Typography
} from '@mui/material'
import Grid from '@mui/material/Grid'
import { Magnify } from 'mdi-material-ui'
import { useState } from 'react'
import CreateMenu from 'src/components/menu/Create'
import { TableList } from 'src/components/menu/TableList'
import { modalStyle } from 'src/configs/modal.config'
import { API_URL } from 'src/constants/environment'
import { axiosInstance, fetcher } from 'src/libs/axios'
import { MenuType, Product, menuItems } from 'src/types/menu'
import { formatCurrency } from 'src/utils/price'
import useSWR from 'swr'

const MenuPage = () => {
  const [open, setOpen] = useState(false)
  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)
  const [search, setSearch] = useState('')
  const [queryParams, setQueryParams] = useState('')
  const [type, setType] = useState('')
  const { data: listProduct, mutate } = useSWR([`${API_URL}/products`, queryParams], ([url, queryParams]) =>
    fetcher(url, queryParams)
  )

  const handleSearch = () => {
    setQueryParams(`${queryParams}&q=${search}`)
  }

  const handleSelectType = (type: string) => {
    setType(type)
    setQueryParams(queryParams ? `${queryParams}&type=${type}` : `type=${type}`)
  }

  return (
    <Grid container spacing={6}>
      <Grid item xs={12} style={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography variant='h5'>Quản lý thực đơn</Typography>
        <Button variant='outlined' onClick={handleOpen}>
          Tạo mới
        </Button>
      </Grid>

      <Box
        sx={{
          display: 'flex',
          gap: '1rem',
          marginBlock: '1.5rem',
          paddingLeft: '0.5rem',
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        <TextField
          size='medium'
          sx={{ '& .MuiOutlinedInput-root': { borderRadius: 4 } }}
          onChange={e => setSearch(e.target.value)}
          value={search}
          InputProps={{
            startAdornment: (
              <InputAdornment position='start'>
                <Magnify fontSize='medium' />
              </InputAdornment>
            )
          }}
        />

        <FormControl>
          <InputLabel id='demo-simple-select-helper-label'>Loại</InputLabel>
          <Select
            labelId='demo-simple-select-helper-label'
            id='demo-simple-select-helper'
            value={type}
            label='Type'
            onChange={e => handleSelectType(e.target.value as string)}
          >
            <MenuItem key={'all'} value={''}>
              ALL
            </MenuItem>
            <MenuItem key={MenuType.DRINK} value={MenuType.DRINK}>
              {MenuType.DRINK}
            </MenuItem>
            <MenuItem key={MenuType.FOOD} value={MenuType.FOOD}>
              {MenuType.FOOD}
            </MenuItem>
          </Select>
        </FormControl>

        <Button onClick={() => handleSearch()} variant='contained' size='large'>
          Tìm kiếm
        </Button>
      </Box>

      <Grid container spacing={6} mt={4}>
        {(listProduct?.data?.data as Product[])?.map((item, index) => (
          <Grid item xs={12} sm={6} md={4}>
            <Card sx={{ display: 'flex', width: '100%' }}>
              <CardMedia
                component='img'
                sx={{ height: '200px', width: '50%', objectFit: 'cover' }}
                image={
                  item?.image_url?.includes('localhost:8000')
                    ? item?.image_url
                    : `http://localhost:8000/${item?.image_url}`
                }
                alt='Live from space album cover'
              />
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  width: '50%',
                  justifyContent: 'center',
                  alignItems: 'center'
                }}
              >
                <CardContent sx={{}}>
                  <Typography component='div' variant='h5'>
                    {item.name}
                  </Typography>
                  <Typography variant='h6' color='text.secondary' component='div'>
                    {formatCurrency(item.price)}
                  </Typography>
                </CardContent>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby='modal-modal-title'
        aria-describedby='modal-modal-description'
      >
        <CreateMenu mutate={mutate} style={modalStyle} handleClose={handleClose} />
      </Modal>
    </Grid>
  )
}

export default MenuPage
