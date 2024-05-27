// ** MUI Imports
import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Checkbox,
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
import { useRouter } from 'next/router'
import { useState } from 'react'
import CreateMenu from 'src/components/menu/Create'
import NhapKho from 'src/components/menu/NhapKho'
import { TableList } from 'src/components/menu/TableList'
import { modalStyle } from 'src/configs/modal.config'
import { API_URL } from 'src/constants/environment'
import { axiosInstance, fetcher } from 'src/libs/axios'
import { MenuType, Product } from 'src/types/menu'
import { formatCurrency } from 'src/utils/price'
import useSWR from 'swr'
import Plus from 'mdi-material-ui/Plus'
import Delete from 'mdi-material-ui/Delete'
import { menuService } from 'src/services/menu'
import toast from 'react-hot-toast'

const MenuPage = () => {
  const [open, setOpen] = useState(false)
  const [openImport, setOpenImport] = useState(false)
  const router = useRouter()

  const handleOpen = () => setOpen(true)
  const handleOpenImport = () => setOpenImport(true)

  const handleClose = () => setOpen(false)
  const handleCloseImport = () => setOpenImport(false)

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

  const goDetail = (id: number) => {
    router.push(`/menu/${id}`)
  }

  const handleDelete = (id: number) => {
    menuService
      .delete(id)
      .then(() => {
        toast.success('Xóa thành công')
        mutate()
      })
      .catch(() => {
        toast.error('Xóa thất bại')
      })
  }

  return (
    <Grid container spacing={6}>
      <Grid item xs={12} style={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography variant='h5'>Quản lý thực đơn</Typography>

        <Box sx={{ display: 'flex', gap: '10px' }}>
          <Button variant='outlined' onClick={handleOpen}>
            Tạo mới
          </Button>
          <Button variant='contained' onClick={handleOpenImport}>
            Nhập kho
          </Button>
        </Box>
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
                sx={{ height: '200px', width: '50%', objectFit: 'cover', cursor: 'pointer' }}
                image={
                  item?.image_url?.includes('localhost:8000')
                    ? item?.image_url
                    : `http://localhost:8000/${item?.image_url}`
                }
                alt='Live from space album cover'
                onClick={() => goDetail(item.id)}
              />
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  width: '70%'
                }}
              >
                <CardContent
                  sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', cursor: 'pointer' }}
                  onClick={() => goDetail(item.id)}
                >
                  <Typography component='div' variant='h5'>
                    {item.name}
                  </Typography>
                  <Typography variant='h6' color='text.secondary' component='div'>
                    {formatCurrency(item.price)}
                  </Typography>
                  <Typography variant='h6' color='text.secondary' component='div'>
                    SL: {item.current_quantity}
                  </Typography>
                </CardContent>
                <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <Button onClick={() => handleDelete(item.id)}>
                    <Delete />
                  </Button>
                </Box>
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

      <Modal
        open={openImport}
        onClose={handleCloseImport}
        aria-labelledby='modal-modal-title'
        aria-describedby='modal-modal-description'
      >
        <NhapKho mutate={mutate} style={modalStyle} handleClose={handleCloseImport} />
      </Modal>
    </Grid>
  )
}

export default MenuPage
