// ** MUI Imports
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'

// ** Demo Components Imports
import CardSupport from 'src/views/cards/CardSupport'
import CardStatistic from 'src/components/dashboard/CardStatistic'
import { Box, Paper } from '@mui/material'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardMedia from '@mui/material/CardMedia'
import IconButton from '@mui/material/IconButton'

import CurrencyUsd from 'mdi-material-ui/CurrencyUsd'
import FoodForkDrink from 'mdi-material-ui/FoodForkDrink'

import AccountMultiple from 'mdi-material-ui/AccountMultiple'

import Billiards from 'mdi-material-ui/Billiards'

import NotePlus from 'mdi-material-ui/NotePlus'

// import Typography from '@mui/material/Typography'
// import SkipPreviousIcon from '@mui/icons-material/SkipPrevious'
// import PlayArrowIcon from '@mui/icons-material/PlayArrow'
// import SkipNextIcon from '@mui/icons-material/SkipNext'

const Dashboard = () => {
  const itemsStatistic = [
    {
      icon: CurrencyUsd,
      title: 'Doanh thu',
      value: '1.2M'
    },
    {
      icon: NotePlus,
      title: 'Hóa đơn',
      value: '12'
    },
    {
      icon: FoodForkDrink,
      title: 'Món ăn',
      value: '10'
    },
    {
      icon: AccountMultiple,
      title: 'Nhân viên',
      value: '15'
    },
    {
      icon: Billiards,
      title: 'Bàn',
      value: '7'
    }
  ]

  const topTables = [
    {
      name: 'Bàn 1',
      revenue: '1.2M'
    },
    {
      name: 'Bàn 2',
      revenue: '1.2M'
    },
    {
      name: 'Bàn 3',
      revenue: '1.2M'
    },
    {
      name: 'Bàn 4',
      revenue: '1.2M'
    },
    {
      name: 'Bàn 5',
      revenue: '1.2M'
    }
  ]

  return (
    <Grid container spacing={2} gap={12}>
      <Grid container spacing={6}>
        {itemsStatistic.map((item, index) => (
          <Grid item xs={12} sm={6} md={12 / 5}>
            <CardStatistic icon={item.icon} title={item.title} value={item.value} />
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={2}>
        <Grid item xs={6}>
          <Typography variant='h4' sx={{ marginBottom: 6 }}>
            Top bàn doanh thu cao nhất
          </Typography>
          <Paper>
            <Grid flexDirection={'column'} container gap={8}>
              {topTables.map((table, index) => (
                <Card sx={{ display: 'flex', padding: '10px' }}>
                  <CardMedia
                    component='img'
                    sx={{ width: 151 }}
                    image='https://scontent.fsgn8-4.fna.fbcdn.net/v/t1.15752-9/438270987_6858749857560668_8307698790179701267_n.png?_nc_cat=108&ccb=1-7&_nc_sid=5f2048&_nc_ohc=C0bzvp88GdoQ7kNvgHO4eyX&_nc_ht=scontent.fsgn8-4.fna&oh=03_Q7cD1QHdBre8BoS-eyLlY1i2Im-AuRLO3ThD-cOGlqUtret2UQ&oe=6662AEA2'
                    alt='Live from space album cover'
                  />
                  <Box
                    sx={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '0 20px'
                    }}
                  >
                    <Typography component='div' variant='h5'>
                      {table.name}
                    </Typography>
                    <Typography variant='h5' color='text.secondary' component='div'>
                      {table.revenue}
                    </Typography>
                  </Box>
                </Card>
              ))}
            </Grid>
          </Paper>
        </Grid>
        <Grid item xs={6}>
          <Typography variant='h4' sx={{ marginBottom: 6 }}>
            Top bàn doanh thu cao nhất
          </Typography>

          <Paper>
            <Grid flexDirection={'column'} container gap={8}>
              {topTables.map((table, index) => (
                <Card sx={{ display: 'flex', padding: '10px' }}>
                  <CardMedia
                    component='img'
                    sx={{ width: 151 }}
                    image='https://scontent.fsgn8-4.fna.fbcdn.net/v/t1.15752-9/438270987_6858749857560668_8307698790179701267_n.png?_nc_cat=108&ccb=1-7&_nc_sid=5f2048&_nc_ohc=C0bzvp88GdoQ7kNvgHO4eyX&_nc_ht=scontent.fsgn8-4.fna&oh=03_Q7cD1QHdBre8BoS-eyLlY1i2Im-AuRLO3ThD-cOGlqUtret2UQ&oe=6662AEA2'
                    alt='Live from space album cover'
                  />
                  <Box
                    sx={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '0 20px'
                    }}
                  >
                    <Typography component='div' variant='h5'>
                      {table.name}
                    </Typography>
                    <Typography variant='h5' color='text.secondary' component='div'>
                      {table.revenue}
                    </Typography>
                  </Box>
                </Card>
              ))}
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Grid>
  )
}

export default Dashboard
