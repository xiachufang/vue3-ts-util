import { dayjsConvert } from '../src'
import dayjs from 'dayjs'
import toArray from 'dayjs/plugin/toArray'
dayjs.extend(toArray)
describe('dayjsConvert', () => {

  it('传入字符串时转成dayjs实例', () => {
    const m = dayjsConvert('2021-07-02 18:31:06')
    expect(dayjs(m).toArray().slice(0, 6)).toEqual([2021, 7 - 1, 2, 18, 31, 6])
  })

  it('传入dayjs实例返回格式化字符串', () => {
    const inst = dayjsConvert('2021-07-02 18:31:06')
    expect(dayjsConvert(inst)).toBe('2021-07-02 18:31:06')
  })

  it('不传参数返回一个实例', () => {
    const m = dayjsConvert()
    expect(m.diff(Date.now()) < 10).toBeTruthy()
  })
})
