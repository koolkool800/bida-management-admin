import { Box, BoxProps, Button, Typography, styled } from '@mui/material'
import React from 'react'

const BoxWrapper = styled(Box)<BoxProps>(({ theme }) => ({
  [theme.breakpoints.down('md')]: {
    width: '90vw'
  }
}))

const Img = styled('img')(({ theme }) => ({
  marginBottom: theme.spacing(10),
  [theme.breakpoints.down('lg')]: {
    height: 450,
    marginTop: theme.spacing(10)
  },
  [theme.breakpoints.down('md')]: {
    height: 400
  },
  [theme.breakpoints.up('lg')]: {
    marginTop: theme.spacing(13)
  }
}))

const EmptyTableList = () => {
  return (
    <Box className='content-center'>
      <Box sx={{ p: 5, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
        <BoxWrapper>
          <Typography variant='h1'>404</Typography>
          <Typography variant='h5' sx={{ mb: 1, fontSize: '1.5rem !important' }}>
            Empty list ⚠️
          </Typography>
          <Typography variant='body2'>Currently there is no data in page you are looking for.</Typography>
        </BoxWrapper>
        <Img height='487' alt='error-illustration' src='/images/pages/404.png' />
        {/* <Link passHref href='/'> */}
        <Button component='a' variant='contained' sx={{ px: 5.5 }}>
          Back to Home
        </Button>
        {/* </Link> */}
      </Box>
    </Box>
  )
}

export default EmptyTableList
