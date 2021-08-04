import { delayFn, FetchQueue } from '../../src'

// cancel和其他几个测试用例放到一起会显示其他几个测试用例抛出了FetchTaskCancel的异常，原因未知
describe('FetchQueue 资源获取队列', () => {
  jest.setTimeout(10_000)

  it('使用cancel取消超时的任务', async () => {
    const fn = jest.fn()
    const queue = new FetchQueue()
    const task = queue.pushAction(delayFn(999999))
    setTimeout(() => task.cancel(), 100)
    try {
      await task.res
    } catch (error) {
      fn()
    }
    expect(fn).toBeCalled()
  })
})
