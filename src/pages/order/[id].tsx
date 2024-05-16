import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Checkbox,
  Grid,
  Modal,
  Paper,
  TextField,
  Typography
} from '@mui/material'
import { useRouter } from 'next/router'
import React, { useState } from 'react'

import Account from 'mdi-material-ui/Account'
import CalendarArrowRight from 'mdi-material-ui/CalendarArrowRight'
import CalendarArrowLeft from 'mdi-material-ui/CalendarArrowLeft'
import CreditCardOutline from 'mdi-material-ui/CreditCardOutline'
import Plus from 'mdi-material-ui/Plus'

import CloudPrint from 'mdi-material-ui/CloudPrint'

import CurrencyUsd from 'mdi-material-ui/CurrencyUsd'
import { formatCurrency } from 'src/utils/price'
import { OrderDetail, Product, menuItems } from 'src/types/menu'
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
import { saveAs } from 'file-saver'
type FormValues = {
  customer_name: string
  customer_phone: string
}

type FormValuesMenuUpdateForOrder = {
  quantity: number
  product_id: number
  price: number
}

const Detail = () => {
  const router = useRouter()
  const { handleSubmit, register, watch } = useForm<FormValues>()
  const {
    register: registerMenu,
    handleSubmit: handleSubmitMenu,
    watch: watchMenu
  } = useForm<FormValuesMenuUpdateForOrder>()

  const [isOpenAddProduct, setIsOpenAddProduct] = useState(false)
  const [menuIds, setMenuIds] = useState<number[]>([])
  const [quantityByMenuIds, setQuantityByMenuIds] = useState<{ quantity: number; id: number }[]>([])

  const handleOpenAddProduct = () => setIsOpenAddProduct(true)
  const handleCloseAddProduct = () => setIsOpenAddProduct(false)

  const id = router.query.id

  const { data: orderData, mutate } = useSWR(id ? `${API_URL}/orders/${id}` : null, fetcher)
  const { data: orderDataPrice, mutate: loadTotalPrice } = useSWR(`${API_URL}/orders/${id}/total-price`, fetcher)
  const { data: listProduct, mutate: mutateProduct } = useSWR(`${API_URL}/products`, fetcher)
  const orderDetail = (orderData?.data as Order) || {}
  const totalPrice = orderDataPrice?.data.total_price || 0
  const user = getUserLocal()

  const handleCheck = (id: number) => {
    if (menuIds.includes(id)) {
      const newIds = menuIds.filter(item => item !== id)
      setMenuIds(newIds)
    } else {
      setMenuIds([...menuIds, id])
    }
  }

  const renderQuantity = (menuId: number) => {
    const quantity = quantityByMenuIds.find(item => item.id === menuId)
    return quantity?.quantity || 1
  }

  const handleSetQuantity = (menuId: number, quantity: number) => {
    if (quantityByMenuIds.length === 0) {
      setQuantityByMenuIds([{ id: menuId, quantity }])
    } else {
      const isExist = quantityByMenuIds.find(item => item.id === menuId)
      let items = []
      if (isExist) {
        const newQuantityByMenuIds = quantityByMenuIds.map(item => {
          if (item.id === menuId) {
            return { ...item, quantity: quantity + 1 }
          } else {
            return {
              ...item
            }
          }
        })
        items = newQuantityByMenuIds
      } else {
        items = [...quantityByMenuIds, { id: menuId, quantity }]
      }

      setQuantityByMenuIds(items)
    }
  }

  const onSubmit = async (data: FormValues) => {
    try {
      const response = await orderService.checkOut({
        order_id: Number(id),
        customer_name: data.customer_name,
        customer_phone: data.customer_phone
      })

      if (response?.message === 'Successfully') {
        toast.success('Thanh toán thành công', { position: 'top-right' })
      }
    } catch (error) {}

    mutate()
    loadTotalPrice()
  }

  const onSubmitMenu = async (data: FormValuesMenuUpdateForOrder) => {
    try {
      const products = listProduct?.data?.data as Product[]
      const productsBody = quantityByMenuIds.map(item => {
        const product = products.find(product => product.id === item.id)
        return {
          price: product?.price || 0,
          product_id: item.id,
          quantity: item.quantity
        }
      })

      if (productsBody.length === 0) {
        toast.error('Vui lòng chọn món')
        return
      }

      await orderService.updateProduct({
        order_id: Number(id),
        products: productsBody
      })

      toast.success('Thêm thành công', {
        position: 'top-right'
      })
      mutate()
    } catch (error) {}

    setQuantityByMenuIds([])
  }

  const handleDownloadBill = async () => {
    try {
      const response = await fetch(`http://localhost:8000/api/v1/orders/${id}/download`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/pdf'
        }
      })

      const blob = await response.blob()
      saveAs(blob, 'invoice.pdf')
      toast.success('Tải hóa đơn thành công', { position: 'top-right' })
    } catch (error) {
      toast.error('Tải hóa đơn thất bại', { position: 'top-right' })
    }
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
          disabled={!orderDetail?.total_price}
          sx={{ height: '50px' }}
          variant='outlined'
          onClick={() => handleDownloadBill()}
        >
          <CloudPrint />
          <Typography sx={{ ml: '12px' }}>In hóa đơn</Typography>
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
                            fullWidth
                            disabled={!!orderDetail?.total_price}
                            id='customer_name'
                            label={orderDetail?.customer_name ? '' : 'Tên khách hàng'}
                            value={orderDetail?.customer_name}
                            sx={{ marginBottom: 4 }}
                            {...register('customer_name', { required: true })}
                          />
                        </Box>

                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                          <TextField
                            fullWidth
                            disabled={!!orderDetail?.total_price}
                            id='customer_phone'
                            label={orderDetail?.customer_phone ? '' : 'SDT'}
                            value={orderDetail?.customer_phone}
                            sx={{ marginBottom: 4 }}
                            {...register('customer_phone', { required: true, pattern: /^[0-9\b]+$/ })}
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
              <Paper sx={{ maxHeight: '1000px', overflow: 'scroll' }}>
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
      <form onSubmit={handleSubmitMenu(onSubmitMenu)}>
        <Grid item xs={12} style={{ display: 'flex', justifyContent: 'space-between', marginTop: '50px' }}>
          <Typography variant='h5'>Thêm món</Typography>
          <Button disabled={!!orderDetail?.total_price} sx={{ height: '50px' }} variant='outlined' type='submit'>
            Thêm món cho bàn
          </Button>
        </Grid>
        <Grid container spacing={6} mt={4}>
          {(listProduct?.data?.data as Product[])?.map((item, index) => (
            <Grid item xs={12} sm={6} md={4}>
              <Card sx={{ display: 'flex', width: '100%' }}>
                <CardMedia
                  component='img'
                  sx={{ height: '200px', width: '50%', objectFit: 'cover' }}
                  image={
                    item?.image_url?.includes('localhost:8000')
                      ? item?.image_url
                      : `http://localhost:8000/${item?.image_url}`
                  }
                  alt='Live from space album cover'
                />
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    width: '100%',
                    cursor: 'pointer'
                  }}
                >
                  <CardContent sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <Typography component='div' variant='h5'>
                      {item.name}
                    </Typography>
                    <Typography variant='h6' color='text.secondary' component='div'>
                      {formatCurrency(item.price)}
                    </Typography>
                  </CardContent>
                  <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <Checkbox checked={menuIds.includes(item.id)} onClick={() => handleCheck(item.id)} />
                    {menuIds.includes(item.id) && (
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Typography variant='h6'>
                          {quantityByMenuIds.find(menu => menu.id === item.id)?.quantity || 0}
                        </Typography>
                        <Button onClick={() => handleSetQuantity(item.id, renderQuantity(item.id))}>
                          <Plus />
                        </Button>
                      </Box>
                    )}
                  </Box>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      </form>

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
