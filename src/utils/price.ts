export const formatCurrency = (price: number) => {
  if (!price) return ''
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price)
}

/**
 *
 * @param price example : 10000000
 * @returns example : 10000k
 */
export const transformToKVNDPrice = (price: number) => {}
