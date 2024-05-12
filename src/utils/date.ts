export const getHourMinute = (date: string | Date) => {
  if (!date) return ''
  const newDate = new Date(date)
  return newDate.toLocaleTimeString()
}
