// ** React Imports
import { ChangeEvent, MouseEvent, useState, SyntheticEvent, FormEvent } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Link from '@mui/material/Link'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import CardHeader from '@mui/material/CardHeader'
import InputLabel from '@mui/material/InputLabel'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import FormControl from '@mui/material/FormControl'
import OutlinedInput from '@mui/material/OutlinedInput'
import InputAdornment from '@mui/material/InputAdornment'
import FormHelperText from '@mui/material/FormHelperText'

// ** Icons Imports
import EyeOutline from 'mdi-material-ui/EyeOutline'
import EyeOffOutline from 'mdi-material-ui/EyeOffOutline'
import { Fade, MenuItem, Modal, Select, SelectChangeEvent, SxProps } from '@mui/material'
import { Theme } from '@mui/system'
import { Resolver, useForm } from 'react-hook-form'
import useSWR, { KeyedMutator } from 'swr'
import { API_URL } from 'src/constants/environment'
import { fetcher } from 'src/libs/axios'
import { SettingTable } from 'src/types/setting'
import { formatCurrency } from 'src/utils/price'
import { tableService } from 'src/services/table'
import toast from 'react-hot-toast'
import { Product } from 'src/types/menu'
import { modalStyle } from 'src/configs/modal.config'
import { orderService } from 'src/services/order'

type FormValues = {
  quantity: number
  product_id: number
  price: number
}

const UpdateOrder = ({
  style,
  mutate,
  handleClose,
  orderId
}: {
  orderId: number
  handleClose: () => void
  mutate: KeyedMutator<any>
  style?: SxProps<Theme> | undefined
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch
  } = useForm<FormValues>()

  const { data: listProduct } = useSWR(`${API_URL}/products?pageSize=10000`, queryParams => fetcher(queryParams))
  const [openAddMenu, setOpenAddMenu] = useState(false)

  const onSubmit = async (data: FormValues) => {
    try {
      const products = listProduct?.data?.data as Product[]
      const price = products?.find(product => product.id === data.product_id)?.price || 0

      const response = await orderService.updateProduct({
        order_id: orderId,
        products: [
          {
            price: price,
            product_id: data.product_id,
            quantity: data.quantity
          }
        ]
      })

      if (response?.data === 1) {
        toast.success('Thêm thành công', {
          position: 'top-right'
        })
      }

      mutate()
    } catch (error) {}

    handleClose()
  }

  return (
    <Card sx={style}>
      <CardHeader title='Thực đơn của bàn' titleTypographyProps={{ variant: 'h6' }} />
      <CardContent>
        <Button variant='contained' size='large' sx={{ mt: 4 }} onClick={() => setOpenAddMenu(true)}>
          Thêm món
        </Button>

        <Modal
          aria-labelledby='transition-modal-title'
          aria-describedby='transition-modal-description'
          open={openAddMenu}
          onClose={() => setOpenAddMenu(false)}
          closeAfterTransition
          children={
            <Fade in={openAddMenu}>
              <form onSubmit={handleSubmit(onSubmit)}>
                <Box sx={modalStyle}>
                  <Grid container spacing={2}>
                    <CardHeader title='Thêm món' titleTypographyProps={{ variant: 'h6' }} />

                    <Grid item xs={12}>
                      <FormControl fullWidth>
                        <InputLabel id='demo-simple-select-helper-label'>Thực đơn</InputLabel>
                        <Select
                          labelId='demo-simple-select-helper-label'
                          id='demo-simple-select-helper'
                          value={watch('product_id')}
                          label='Type'
                          {...register('product_id', {
                            required: true
                          })}
                        >
                          {listProduct?.data?.data?.map((product: any) => {
                            return (
                              <MenuItem key={product.id} value={product.id}>
                                {product?.name} - {formatCurrency(product.price)}
                              </MenuItem>
                            )
                          })}
                        </Select>
                        <FormHelperText>Loại bàn và giá / giờ</FormHelperText>
                      </FormControl>
                    </Grid>

                    <Grid item xs={12}>
                      <TextField fullWidth label='SL' placeholder='1' {...register('quantity', { required: true })} />
                    </Grid>

                    <Grid item xs={12}>
                      <Box
                        sx={{
                          gap: 5,
                          display: 'flex',
                          flexWrap: 'wrap',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          pt: 4
                        }}
                      >
                        <Button type='submit' variant='contained' size='large'>
                          Thêm
                        </Button>
                      </Box>
                    </Grid>
                  </Grid>
                </Box>
              </form>
            </Fade>
          }
        />
      </CardContent>
    </Card>
  )
}

export default UpdateOrder
