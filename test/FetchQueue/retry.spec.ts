/* eslint-disable no-plusplus */
import { FetchQueue } from '../../src'

describe.skip('FetchQueue 资源获取队列', () => {
  jest.setTimeout(10_000)

  it('指定重试次数，超出抛异常', async () => {
    const fn = jest.fn()
    let callCount = 0
    const queue = new FetchQueue(-1, 3, 0) // 不限制并发数量,限制重试次数3,重试间隔0
    const { res } = queue.pushAction(() => {
      callCount++
      throw new Error()
    })
    try {
      await res
    } catch (error) {
      fn()
    }
    expect(callCount).toBe(3 + 1)
    expect(fn).toBeCalled()
  })
})
