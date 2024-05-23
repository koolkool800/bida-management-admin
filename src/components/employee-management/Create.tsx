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
import { SxProps } from '@mui/material'
import { Theme } from '@mui/system'
import { Resolver, useForm } from 'react-hook-form'
import { axiosInstance } from 'src/libs/axios'
import { employeeeService } from 'src/services/employee'
import toast from 'react-hot-toast'
import { KeyedMutator } from 'swr'

interface State {
  password: string
  showPassword: boolean
}

type FormValues = {
  name: string
  user_name: string
  password: string
  address: string
  phone: string
}

const CreateEmployee = ({
  style,
  mutate,
  handleClose
}: {
  handleClose: () => void
  mutate: KeyedMutator<any>
  style?: SxProps<Theme> | undefined
}) => {
  // ** States
  const [values, setValues] = useState<State>({
    password: '',
    showPassword: false
  })

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch
  } = useForm<FormValues>()

  const handleClickShowPassword = () => {
    setValues({ ...values, showPassword: !values.showPassword })
  }

  const handleMouseDownPassword = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
  }

  const onSubmit = async (data: FormValues) => {
    try {
      const response = await employeeeService.create(data)
      if (response?.message === 'Successfully') {
        toast.success('Create employee successfully', {
          position: 'top-right'
        })
      }

      mutate()
    } catch (error) {}
    handleClose()
  }

  return (
    <Card sx={style}>
      <CardHeader title='Tạo nhân viên' titleTypographyProps={{ variant: 'h6' }} />
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={5}>
            <Grid item xs={12}>
              <TextField fullWidth label='Tên' placeholder='Leonard Carter' {...register('name', { required: true })} />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                type='text'
                label='Tài khoản'
                placeholder='carterleonard'
                {...register('user_name', {
                  required: true
                })}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                type='text'
                label='Địa chỉ'
                placeholder='carterleonard'
                {...register('address', {
                  required: true
                })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                type='text'
                label='SDT'
                placeholder='carterleonard'
                {...register('phone', {
                  required: true
                })}
              />
            </Grid>

            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel htmlFor='form-layouts-basic-password'>Password</InputLabel>
                <OutlinedInput
                  label='Mật khẩu'
                  value={watch('password')}
                  type={values.showPassword ? 'text' : 'password'}
                  aria-describedby='form-layouts-basic-password-helper'
                  endAdornment={
                    <InputAdornment position='end'>
                      <IconButton
                        edge='end'
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                        aria-label='toggle password visibility'
                      >
                        {values.showPassword ? <EyeOutline /> : <EyeOffOutline />}
                      </IconButton>
                    </InputAdornment>
                  }
                  {...register('password', {
                    required: true
                  })}
                />
                {/* <FormHelperText>Use 8 or more characters with a mix of letters, numbers & symbols</FormHelperText> */}
              </FormControl>
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
                  Tạo mới
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </CardContent>
    </Card>
  )
}

export default CreateEmployee
