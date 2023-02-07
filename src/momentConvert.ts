import dayjs from 'dayjs'
/**
 * 返回一个moment实例
 */
export function momentConvert (): dayjs.Dayjs
/**
  * YYYY-MM-DD HH:mm:ss格式的字符串转成moment
  * @param date 日期字符串 或者 1970到现在的毫秒数
  */
export function momentConvert (date: string | number): dayjs.Dayjs
/**
  * moment转成YYYY-MM-DD HH:mm:ss格式的字符串
  * @param date moment
  */
export function momentConvert (date: dayjs.Dayjs): string
export function momentConvert (date?: any) {
  if (date) {
    if (typeof date === 'string' || typeof date === 'number') {
      return dayjs(date)
    }
    return date.format('YYYY-MM-DD HH:mm:ss')
  }
  return dayjs()
}
