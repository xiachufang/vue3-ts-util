import dayjs from 'dayjs'
/**
 * 返回一个dayjs实例
 */
export function dayjsConvert (): dayjs.Dayjs
/**
  * YYYY-MM-DD HH:mm:ss格式的字符串转成dayjs
  * @param date 日期字符串 或者 1970到现在的毫秒数
  */
export function dayjsConvert (date: string | number): dayjs.Dayjs
/**
  * dayjs转成YYYY-MM-DD HH:mm:ss格式的字符串
  * @param date dayjs
  */
export function dayjsConvert (date: dayjs.Dayjs): string
export function dayjsConvert (date?: any) {
  if (date) {
    if (typeof date === 'string' || typeof date === 'number') {
      return dayjs(date)
    }
    return date.format('YYYY-MM-DD HH:mm:ss')
  }
  return dayjs()
}
