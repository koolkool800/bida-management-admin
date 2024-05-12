import { Box, Button, Grid, Modal, Paper, Typography } from '@mui/material'
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

const Detail = () => {
  const router = useRouter()
  const [isOpenAddProduct, setIsOpenAddProduct] = useState(false)
  const handleOpenAddProduct = () => setIsOpenAddProduct(true)
  const handleCloseAddProduct = () => setIsOpenAddProduct(false)

  const id = router.query.id

  const { data: orderData, mutate } = useSWR(id ? `${API_URL}/orders/${id}` : null, fetcher)
  const orderDetail = (orderData?.data as Order) || {}
  const user = getUserLocal()

  return (
    <Grid container spacing={6}>
      <Grid item xs={12} style={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography variant='h3'>Hóa đơn chi tiết</Typography>
        <Button variant='outlined' onClick={() => handleOpenAddProduct()}>
          Thêm món cho bàn
        </Button>
      </Grid>
      <Grid item xs={12}>
        <Grid container spacing={12}>
          <Grid item xs={4}>
            <Box>
              <Typography variant='h4' sx={{ pb: 8 }}>
                Hóa đơn: {id}
              </Typography>
              <Paper sx={{ display: 'flex', flexDirection: 'column', gap: 8, p: '20px' }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 8, p: '20px' }}>
                  <Typography variant='h6'>Thông tin chi tiết</Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      <Account />
                      <Typography variant='h6'>{user?.name}</Typography>
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
                      <Typography variant='h6'>{formatCurrency(orderDetail?.total_price)}</Typography>
                    </Box>
                  </Box>
                </Box>
              </Paper>
            </Box>
          </Grid>
          <Grid item xs={8}>
            <Typography variant='h4' sx={{ pb: 8 }}>
              Danh sách món ăn
            </Typography>
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
                        </Box>
                      </Box>
                    </Box>
                  )
                })}
              </Box>
            </Paper>
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
