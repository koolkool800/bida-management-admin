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

type FormValues = {
  name: string
  settingTableId: number
}

interface ISettingTable {
  id: number
  type: string
  price: number
}

const listSetting: ISettingTable[] = [
  {
    id: 1,
    price: 100000,
    type: 'VIP'
  },
  {
    id: 2,
    price: 50000,
    type: 'NORMAL'
  }
]

const CreateTable = ({ style }: { style?: SxProps<Theme> | undefined }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch
  } = useForm<FormValues>()
  const [settingId, setSettingId] = useState('')

  const onSubmit = handleSubmit(data => {
    console.log('hihi')
    console.log(data)
  })

  return (
    <Card sx={style}>
      <CardHeader title='Create Table' titleTypographyProps={{ variant: 'h6' }} />
      <CardContent>
        <form onSubmit={onSubmit}>
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
                  value={settingId}
                  label='Type'
                  {...register('settingTableId', {
                    required: true
                  })}
                >
                  {listSetting.map(setting => {
                    return (
                      <MenuItem key={setting.id} value={setting.id}>
                        {setting.type} - {setting.price} VND
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
