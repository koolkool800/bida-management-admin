export const getHourMinute = (date: string | Date) => {
  if (!date) return ''
  const newDate = new Date(date)
  return newDate.toLocaleTimeString()
}

export const getDateFormat = (date: string | Date) => {
  if (!date) return ''
  const newDate = new Date(date)
  return newDate.toISOString().split('T')[0]
}
