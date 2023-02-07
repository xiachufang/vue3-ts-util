import { momentConvert } from '../src'
import dayjs from 'dayjs'
import toArray from 'dayjs/plugin/toArray'
dayjs.extend(toArray)
describe('momentConvert', () => {

  it('传入字符串时转成moment实例', () => {
    const m = momentConvert('2021-07-02 18:31:06')
    expect(dayjs(m).toArray().slice(0, 6)).toEqual([2021, 7 - 1, 2, 18, 31, 6])
  })

  it('传入moment实例返回格式化字符串', () => {
    const inst = momentConvert('2021-07-02 18:31:06')
    expect(momentConvert(inst)).toBe('2021-07-02 18:31:06')
  })

  it('不传参数返回一个实例', () => {
    const m = momentConvert()
    expect(m.diff(Date.now()) < 10).toBeTruthy()
  })
})
