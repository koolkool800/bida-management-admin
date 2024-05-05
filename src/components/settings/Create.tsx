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
import { MenuItem, Select, SelectChangeEvent, SxProps } from '@mui/material'
import { Theme } from '@mui/system'
import { Resolver, useForm } from 'react-hook-form'
import { settingService } from 'src/services/setting'
import toast from 'react-hot-toast'
import { KeyedMutator } from 'swr'

type FormValues = {
  price: number
  type: string
}

const CreateSetting = ({
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

  const onSubmit = async (data: FormValues) => {
    try {
      const response = await settingService.create({ price: Number(data.price), type: data.type })
      if (response?.message === 'Successfully') {
        toast.success('Create setting successfully', {
          position: 'top-right'
        })
      }
      mutate()
    } catch (error) {}
    handleClose()
  }

  return (
    <Card sx={style}>
      <CardHeader title='Create new setting' titleTypographyProps={{ variant: 'h6' }} />
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={5}>
            <Grid item xs={12}>
              <TextField fullWidth label='Type' placeholder='VIP' {...register('type', { required: true })} />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label='Price per hour'
                placeholder='1000'
                {...register('price', { required: true })}
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
                  Create
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </CardContent>
    </Card>
  )
}

export default CreateSetting
