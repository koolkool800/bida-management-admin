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

export const getTimeZoneVietNam = (date: string | Date) => {
  if (!date) return ''
  // Given current date and time string
  const currentDateTimeStr: string = date?.toString()

  // Function to parse a date string into a Date object
  const parseDate = (dateStr: string): Date => {
    const [datePart, timePart] = dateStr.split(' ')
    const [year, month, day] = datePart.split('-').map(Number)
    const [hour, minute, second] = timePart.split(':').map(Number)
    return new Date(year, month - 1, day, hour, minute, second)
  }

  // Function to pad single digits with leading zeros
  const padZero = (num: number): string => num.toString().padStart(2, '0')

  // Function to format a Date object into a 'YYYY-MM-DD HH:mm:ss' string
  const formatDate = (date: Date): string => {
    const year = date.getFullYear()
    const month = padZero(date.getMonth() + 1)
    const day = padZero(date.getDate())
    const hour = padZero(date.getHours())
    const minute = padZero(date.getMinutes())
    const second = padZero(date.getSeconds())
    return `${year}-${month}-${day} ${hour}:${minute}:${second}`
  }

  // Parse the given date and time string into a Date object
  const currentDate: Date = parseDate(currentDateTimeStr)

  // Add 7 hours to the current time
  const vietnamTime: Date = new Date(currentDate.getTime() + 7 * 60 * 60 * 1000)

  // Format the new date and time
  const vietnamFormattedStr: string = formatDate(vietnamTime)
  return vietnamFormattedStr
}
