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
  name: string
  price: number
  type: MenuType
  image_url: string
}

const ImgStyled = styled('img')(({ theme }) => ({
  width: 120,
  height: 120,
  marginRight: theme.spacing(6.25),
  borderRadius: theme.shape.borderRadius
}))

const ButtonStyled = styled(Button)<ButtonProps & { component?: ElementType; htmlFor?: string }>(({ theme }) => ({
  [theme.breakpoints.down('sm')]: {
    width: '100%',
    textAlign: 'center'
  }
}))

const ResetButtonStyled = styled(Button)<ButtonProps>(({ theme }) => ({
  marginLeft: theme.spacing(4.5),
  [theme.breakpoints.down('sm')]: {
    width: '100%',
    marginLeft: 0,
    textAlign: 'center',
    marginTop: theme.spacing(4)
  }
}))

const CreateMenu = ({
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
  const [imgSrc, setImgSrc] = useState<string>('https://promova.com/content/fast_food_names_d368a9810d.png')
  const [imgUploaded, setImgUploaded] = useState<string>('')
  const onChange = (event: any) => {
    const reader = new FileReader()
    const { files } = event.target as any

    if (files && files.length !== 0) {
      reader.onload = () => {
        const formData = new FormData()
        const fileSelected = event.target?.files[0]
        formData.append('file', fileSelected)

        uploadFile(formData)
        setImgSrc(reader.result as string)
      }

      reader.readAsDataURL(files[0])
    }
  }

  const uploadFile = (formData: FormData) => {
    axiosInstance()
      .postForm('file', formData)
      .then(response => {
        if (response.data.data.url) {
          setImgUploaded(response.data.data.url)
          toast.success('Upload file successfully', {
            position: 'top-right'
          })
        } else {
          toast.error('Miss file', {
            position: 'top-right'
          })
        }
      })
      .catch(error => {
        toast.error(error.message, {
          position: 'top-right'
        })
      })
  }

  const onSubmit = async (data: FormValues) => {
    try {
      const imageUrl = `http://localhost:8000${imgUploaded}`
      console.log(imageUrl)

      if (!imageUrl) {
        toast.error('Please upload image', {
          position: 'top-right'
        })
      }

      const response = await menuService.create({
        name: data.name,
        price: Number(data.price),
        type: data.type,
        image_url: imageUrl
      })
      if (response?.message === 'Successfully') {
        toast.success('Create setting successfully', {
          position: 'top-right'
        })
      }
      mutate()
    } catch (error) {}
    handleClose()
  }

  useEffect(() => {
    console.log(imgUploaded)
  }, [imgUploaded])

  return (
    <Card sx={style}>
      <CardHeader title='Tạo thực đơn mới' titleTypographyProps={{ variant: 'h6' }} />
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={5}>
            <Grid item xs={12}>
              <TextField fullWidth label='Tên' placeholder='Coca' {...register('name', { required: true })} />
            </Grid>

            <Grid item xs={12} sx={{ marginTop: 4.8, marginBottom: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <ImgStyled src={imgSrc} alt='Profile Pic' />
                <Box>
                  <ButtonStyled component='label' variant='contained' htmlFor='account-settings-upload-image'>
                    Thêm hình ảnh
                    <input
                      hidden
                      type='file'
                      onChange={onChange}
                      accept='image/png, image/jpeg'
                      id='account-settings-upload-image'
                    />
                  </ButtonStyled>
                  <ResetButtonStyled
                    color='error'
                    variant='outlined'
                    onClick={() => setImgSrc('https://promova.com/content/fast_food_names_d368a9810d.png')}
                  >
                    Hủy
                  </ResetButtonStyled>
                  <Typography variant='body2' sx={{ marginTop: 5 }}>
                    Cho phép PNG hoặc JPEG. Tối đa 800K.
                  </Typography>
                </Box>
              </Box>
            </Grid>

            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel id='demo-simple-select-helper-label'>Loại</InputLabel>
                <Select
                  labelId='demo-simple-select-helper-label'
                  id='demo-simple-select-helper'
                  value={watch('type')}
                  label='Type'
                  {...register('type', {
                    required: true
                  })}
                >
                  <MenuItem key={MenuType.DRINK} value={MenuType.DRINK}>
                    {MenuType.DRINK}
                  </MenuItem>
                  <MenuItem key={MenuType.FOOD} value={MenuType.FOOD}>
                    {MenuType.FOOD}
                  </MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <TextField fullWidth label='Giá' placeholder='1000' {...register('price', { required: true })} />
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
                  Tạo
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </CardContent>
    </Card>
  )
}

export default CreateMenu
