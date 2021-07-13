import * as momentAll from 'moment'
import momentDurationFormatSetup from 'moment-duration-format'
export const moment = momentAll.default

momentDurationFormatSetup(momentAll)

/**
 * 返回一个moment实例
 */
export function momentConvert (): moment.Moment
/**
  * YYYY-MM-DD HH:mm:ss格式的字符串转成moment
  * @param date 日期字符串 或者 1970到现在的毫秒数
  */
export function momentConvert (date: string | number): moment.Moment
/**
  * moment转成YYYY-MM-DD HH:mm:ss格式的字符串
  * @param date moment
  */
export function momentConvert (date: moment.Moment): string
export function momentConvert (date?: any) {
  if (date) {
    if (typeof date === 'string' || typeof date === 'number') {
      return moment(date)
    }
    return date.format('YYYY-MM-DD HH:mm:ss')
  }
  return moment()
}
