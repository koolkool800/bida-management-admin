import { Box, Button, Grid, Modal, Paper, TextField, Typography } from '@mui/material'
import { useRouter } from 'next/router'
import React, { useState } from 'react'

import Account from 'mdi-material-ui/Account'
import CalendarArrowRight from 'mdi-material-ui/CalendarArrowRight'
import CalendarArrowLeft from 'mdi-material-ui/CalendarArrowLeft'
import CreditCardOutline from 'mdi-material-ui/CreditCardOutline'
import CurrencyUsd from 'mdi-material-ui/CurrencyUsd'
import { formatCurrency } from 'src/utils/price'
import { OrderDetail, menuItems } from 'src/types/menu'
import useSWR from 'swr'
import { API_URL } from 'src/constants/environment'
import { fetcher } from 'src/libs/axios'
import { getUserLocal } from 'src/utils/localStorage'
import { Order } from 'src/types/order'
import UpdateOrder from 'src/components/table-management/UpdateOrder'
import { modalStyle } from 'src/configs/modal.config'
import { getHourMinute } from 'src/utils/date'
import { useForm } from 'react-hook-form'
import { orderService } from 'src/services/order'
import toast from 'react-hot-toast'

type FormValues = {
  customer_name: string
}

const Detail = () => {
  const router = useRouter()
  const { handleSubmit, register, watch } = useForm<FormValues>()
  const [isOpenAddProduct, setIsOpenAddProduct] = useState(false)
  const handleOpenAddProduct = () => setIsOpenAddProduct(true)
  const handleCloseAddProduct = () => setIsOpenAddProduct(false)

  const id = router.query.id

  const { data: orderData, mutate } = useSWR(id ? `${API_URL}/orders/${id}` : null, fetcher)
  const { data: orderDataPrice, mutate: loadTotalPrice } = useSWR(`${API_URL}/orders/${id}/total-price`, fetcher)
  const orderDetail = (orderData?.data as Order) || {}
  const totalPrice = orderDataPrice?.data.total_price || 0
  const user = getUserLocal()

  const onSubmit = async (data: FormValues) => {
    try {
      const response = await orderService.checkOut({
        order_id: Number(id),
        customer_name: data.customer_name
      })

      if (response?.message === 'Successfully') {
        toast.success('Thanh toán thành công', { position: 'top-right' })
      }
    } catch (error) {}

    mutate()
    loadTotalPrice()
  }

  return (
    <Grid container spacing={6}>
      <Grid item xs={12} style={{ display: 'flex', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', gap: 4, flexDirection: 'column', justifyContent: 'center' }}>
          <Button variant='outlined' onClick={() => router.back()}>
            Back
          </Button>
          <Typography variant='h3'>Hóa đơn chi tiết</Typography>
        </Box>
        <Button
          disabled={!!orderDetail?.total_price}
          sx={{ height: '50px' }}
          variant='outlined'
          onClick={() => handleOpenAddProduct()}
        >
          Thêm món cho bàn
        </Button>
      </Grid>
      <Grid item xs={12}>
        <Grid container spacing={12}>
          <Grid item xs={4}>
            <Box>
              <Typography variant='h4' sx={{ pb: 8 }}>
                Hóa đơn: HD{id}
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <Paper sx={{ display: 'flex', flexDirection: 'column', gap: 8, p: '20px' }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 8, p: '20px' }}>
                    <Typography variant='h6'>Thông tin chi tiết</Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        <Account />
                        <Typography variant='h6'>Nhân viên {user?.name}</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        <CalendarArrowRight />
                        <Typography variant='h6'>Vào lúc {orderDetail?.start_time?.toLocaleString()}</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        <CalendarArrowLeft />
                        <Typography variant='h6'>Ra lúc {orderDetail?.end_time?.toLocaleString()}</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        <CreditCardOutline />
                        <Typography variant='h6'>
                          {orderDetail?.total_price ? 'Đã thanh toán' : 'Chưa thanh toán'}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 8, p: '20px' }}>
                    <Typography variant='h6'>Tổng tiền </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        <CurrencyUsd />
                        <Typography variant='h6'>{formatCurrency(totalPrice)}</Typography>
                      </Box>
                      <Button variant='outlined' disabled={!!orderDetail?.total_price} onClick={() => loadTotalPrice()}>
                        Cập nhật giá hiện tại
                      </Button>
                    </Box>
                  </Box>
                </Paper>
                <Paper>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 8, p: '20px' }}>
                    <Typography variant='h6'>Thanh toán</Typography>
                    <form onSubmit={handleSubmit(onSubmit)}>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                          <TextField
                            autoFocus
                            fullWidth
                            disabled={!!orderDetail?.total_price}
                            id='customer_name'
                            label='Tên khách hàng'
                            sx={{ marginBottom: 4 }}
                            {...register('customer_name', { required: true })}
                          />
                        </Box>

                        <Button disabled={!!orderDetail?.total_price} type='submit' variant='contained'>
                          Thanh toán
                        </Button>
                      </Box>
                    </form>
                  </Box>
                </Paper>
              </Box>
            </Box>
          </Grid>
          <Grid item xs={8}>
            <Typography variant='h4' sx={{ pb: 8 }}>
              Lịch sử đặt món
            </Typography>
            {orderDetail?.order_detail?.length === 0 ? (
              <Typography variant='h6'>Chưa có món nào được đặt</Typography>
            ) : (
              <Paper>
                <Box>
                  {orderDetail?.order_detail?.map((item, idx) => {
                    return (
                      <Box key={idx} sx={{ display: 'flex', gap: 6, p: 5 }}>
                        <img src={item.image_url} alt={item.product_name} style={{ width: '50%', height: 200 }} />
                        <Box
                          sx={{
                            display: 'flex',
                            gap: 2,
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            width: '100%'
                          }}
                        >
                          <Box>
                            <Typography variant='h6'>{item.product_name}</Typography>
                            <Typography variant='h6'>{formatCurrency(item.product_price)}</Typography>
                          </Box>
                          <Box>
                            <Typography variant='h6'>Số lượng: {item.quantity}</Typography>
                            <Typography variant='h6'>
                              Thành tiền: {formatCurrency(item.quantity * item.product_price)}
                            </Typography>
                            <Typography variant='h6'>Thời gian {getHourMinute(item.created_at)}</Typography>
                          </Box>
                        </Box>
                      </Box>
                    )
                  })}
                </Box>
              </Paper>
            )}
          </Grid>
        </Grid>
      </Grid>

      <Modal
        open={isOpenAddProduct}
        onClose={handleCloseAddProduct}
        aria-labelledby='modal-modal-title'
        aria-describedby='modal-modal-description'
      >
        <UpdateOrder
          handleClose={handleCloseAddProduct}
          mutate={mutate}
          style={modalStyle}
          orderId={Number(id as string)}
        />
      </Modal>
    </Grid>
  )
}

export default Detail
