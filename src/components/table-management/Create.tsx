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
import useSWR, { KeyedMutator } from 'swr'
import { API_URL } from 'src/constants/environment'
import { fetcher } from 'src/libs/axios'
import { SettingTable } from 'src/types/setting'
import { formatCurrency } from 'src/utils/price'
import { tableService } from 'src/services/table'
import toast from 'react-hot-toast'

type FormValues = {
  name: string
  settingTableId: number
}

interface ISettingTable {
  id: number
  type: string
  price: number
}

const CreateTable = ({
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

  const { data: listSetting } = useSWR(`${API_URL}/setting-table`, fetcher)

  const onSubmit = async (data: FormValues) => {
    try {
      const response = await tableService.create({
        name: data.name,
        setting_table_id: data.settingTableId
      })

      if (response?.message === 'Successfully') {
        toast.success('Create table successfully', {
          position: 'top-right'
        })
      }

      mutate()
    } catch (error) {}

    handleClose()
  }

  return (
    <Card sx={style}>
      <CardHeader title='Create Table' titleTypographyProps={{ variant: 'h6' }} />
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={5}>
            <Grid item xs={12}>
              <TextField fullWidth label='Name' placeholder='Ban VIP' {...register('name', { required: true })} />
            </Grid>

            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel id='demo-simple-select-helper-label'>Type</InputLabel>
                <Select
                  labelId='demo-simple-select-helper-label'
                  id='demo-simple-select-helper'
                  value={watch('settingTableId')}
                  label='Type'
                  {...register('settingTableId', {
                    required: true
                  })}
                >
                  {listSetting?.data?.data.map((setting: SettingTable) => {
                    return (
                      <MenuItem key={setting.id} value={setting.id}>
                        {setting.type} - {formatCurrency(setting.price)}
                      </MenuItem>
                    )
                  })}
                </Select>
                <FormHelperText>Type and price/hour</FormHelperText>
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

export default CreateTable
