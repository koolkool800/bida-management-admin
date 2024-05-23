// ** React Imports
import { ChangeEvent, MouseEvent, useState, SyntheticEvent, FormEvent, ElementType, useEffect } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Link from '@mui/material/Link'
import Button, { ButtonProps } from '@mui/material/Button'
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
import { MenuItem, Select, SelectChangeEvent, SxProps, styled } from '@mui/material'
import { Theme } from '@mui/system'
import { Resolver, useForm } from 'react-hook-form'
import { settingService } from 'src/services/setting'
import toast from 'react-hot-toast'
import useSWR, { KeyedMutator } from 'swr'
import { API_URL } from 'src/constants/environment'
import { axiosInstance, fetcher } from 'src/libs/axios'
import { SettingTable } from 'src/types/setting'
import { formatCurrency } from 'src/utils/price'
import axios from 'axios'
import { menuService } from 'src/services/menu'
import { MenuType } from 'src/types/menu'

type FormValues = {
  quantity: number
  product_id: number
}

const NhapKho = ({
  style,
  mutate,
  handleClose
}: {
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
  const { data: listProduct } = useSWR(`${API_URL}/products`, fetcher)

  const onSubmit = async (formData: FormValues) => {
    try {
      const data = {
        products: [
          {
            quantity: formData.quantity,
            product_id: formData.product_id
          }
        ]
      }
      await menuService.import(data)

      toast.success('Create setting successfully', {
        position: 'top-right'
      })
      mutate()
    } catch (error) {}
    handleClose()
  }

  return (
    <Card sx={style}>
      <CardHeader title='Nhập kho' titleTypographyProps={{ variant: 'h6' }} />
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={5}>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel id='demo-simple-select-helper-label'>Sản phẩm</InputLabel>
                <Select
                  labelId='demo-simple-select-helper-label'
                  id='demo-simple-select-helper'
                  value={watch('product_id')}
                  label='Sản phẩm'
                  {...register('product_id', {
                    required: true
                  })}
                >
                  {listProduct?.data?.data?.map((item: any) => {
                    return (
                      <MenuItem key={item?.id} value={item?.id}>
                        {item?.name}
                      </MenuItem>
                    )
                  })}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              {/* validate number only */}
              <TextField
                type='number'
                fullWidth
                label='SL'
                placeholder='1'
                {...register('quantity', { required: true })}
              />
            </Grid>

            <Grid item xs={12}>
              <Box
                sx={{
                  gap: 5,
                  display: 'flex',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <Button type='submit' variant='contained' size='large'>
                  Nhập kho
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </CardContent>
    </Card>
  )
}

export default NhapKho
