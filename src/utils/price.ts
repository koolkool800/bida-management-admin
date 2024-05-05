export const formatCurrency = (price: number) => {
  if (!price) return ''
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price)
}
