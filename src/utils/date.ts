export const getHourMinute = (date: string) => {
  if (!date) return ''
  const newDate = new Date(date)
  return newDate.toLocaleTimeString()
}
