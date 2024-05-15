'use client'
import { Avatar, Box, Button, Card, Checkbox, Fade, Grid, Modal, Stack, Typography } from '@mui/material'
import { deepOrange } from '@mui/material/colors'
import { useRouter } from 'next/router'
import { set } from 'nprogress'
import React, { useEffect, useState } from 'react'
import { API_URL } from 'src/constants/environment'
import { fetcher } from 'src/libs/axios'
import { TableType } from 'src/types/table'
import useSWR, { KeyedMutator } from 'swr'
import Billiards from 'mdi-material-ui/Billiards'
import BilliardsRack from 'mdi-material-ui/BilliardsRack'
import themeConfig from 'src/configs/themeConfig'
import { MODE, getUserLocal, localHandler } from 'src/utils/localStorage'
import Eye from 'mdi-material-ui/Eye'
import CheckOutline from 'mdi-material-ui/CheckOutline'
import { modalStyle } from 'src/configs/modal.config'
import { orderService } from 'src/services/order'
import toast from 'react-hot-toast'
import { Order } from 'src/types/order'

type Props = {
  items: TableType[]
  mutate: KeyedMutator<any>
}

const NewTableList = ({ items, mutate }: Props) => {
  const router = useRouter()
  const [checkinModalOpen, setCheckinModalOpen] = useState<boolean>(false)
  const [checkinRow, setCheckinRow] = useState<number | null>(null)
  const user = getUserLocal()
  const { data: listTableBooking, mutate: mutateBooking } = useSWR(`${API_URL}/orders`, fetcher)
  const listOrder = listTableBooking?.data?.data as Order[]
  console.log(listOrder)
  const handleCheck = (id: number) => {}

  const handleNavigate = (id: number) => {
    router.push(`/table-management/${id}`)
  }

  const checkTableAvailable = (id: number) => {
    return listOrder?.some(order => order.table_id === id && order.end_time === null)
  }

  const handleOpenCheckinModal = (id: number) => {
    if (checkTableAvailable(id)) {
      const orderId = listOrder?.find(order => order.table_id === id && order.end_time === null)?.id
      router.push(`/order/${orderId}`)
    } else {
      setCheckinRow(id)
      setCheckinModalOpen(true)
    }
  }

  const handleCloseCheckinModal = () => {
    setCheckinRow(null)
    setCheckinModalOpen(false)
  }

  const handleCheckInTable = async () => {
    try {
      await orderService.checkIn({
        table_id: Number(checkinRow),
        user_id: user?.id as number
      })

      toast.success('Check in bàn thành công', {
        position: 'top-right'
      })

      mutate()
      mutateBooking()
    } catch (error) {
      toast.error('Check in bàn thất bại')
    }
    handleCloseCheckinModal()
  }

  return (
    <Grid container spacing={2} gap={12}>
      <Grid container spacing={6}>
        {items?.map(item => (
          <Grid item xs={12} sm={6} md={3}>
            <Stack
              sx={{
                background: `${localHandler.getLocal(MODE) === 'light' ? 'white' : '#312D4B'}`,
                borderRadius: '4px',
                width: '300px',
                height: '200px',
                'box-shadow': `${
                  localHandler.getLocal(MODE) === 'light'
                    ? 'rgba(149, 157, 165, 0.2) 0px 8px 24px'
                    : 'rgba(59, 60, 60, 0.2) 0px 8px 24px'
                }`
              }}
              direction={'row'}
              alignItems={'center'}
              spacing={4}
            >
              <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%', cursor: 'pointer' }}>
                <Box
                  sx={{
                    cursor: 'pointer',
                    display: 'flex',
                    justifyContent: 'center',
                    width: '100%',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '12px'
                  }}
                >
                  <Button onClick={() => handleOpenCheckinModal(item.id)}>
                    {checkTableAvailable(item.id) ? <Eye /> : <CheckOutline />}
                  </Button>
                  <Box
                    sx={{
                      border: localHandler.getLocal(MODE) === 'light' ? '1px solid black' : '1px solid white',
                      borderRadius: '50%',
                      width: '50px',
                      height: '50px',
                      display: 'flex',
                      justifyContent: 'center',
                      flexDirection: 'column',
                      alignItems: 'center'
                    }}
                    onClick={() => handleNavigate(item.id)}
                  >
                    <BilliardsRack />
                  </Box>
                  <Box onClick={() => handleNavigate(item.id)}>
                    <Typography variant='body1'>
                      {item.name} {item.type}
                    </Typography>
                  </Box>
                  <Box onClick={() => handleNavigate(item.id)}>
                    <Typography variant='body1'>{item.is_available ? 'Trống' : 'Có người'}</Typography>
                  </Box>
                </Box>
              </Box>
            </Stack>
          </Grid>
        ))}
      </Grid>

      <Modal
        aria-labelledby='transition-modal-title'
        aria-describedby='transition-modal-description'
        open={checkinModalOpen}
        onClose={handleCloseCheckinModal}
        closeAfterTransition
        children={
          <Fade in={checkinModalOpen}>
            <Box sx={modalStyle}>
              <Typography id='transition-modal-title' variant='h6' component='h2'>
                Check in bàn
              </Typography>
              <Typography id='transition-modal-description' sx={{ mt: 2 }}>
                Bạn có chắc chắn muốn check in bàn này?
              </Typography>

              <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', pt: '1rem' }}>
                <Button variant='contained' onClick={() => handleCloseCheckinModal()}>
                  Hủy
                </Button>
                <Button variant='outlined' onClick={() => handleCheckInTable()}>
                  Check in
                </Button>
              </Box>
            </Box>
          </Fade>
        }
      />
    </Grid>
  )
}

export default NewTableList
