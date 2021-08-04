/* eslint-disable no-plusplus */
import { delayFn, FetchQueue, delay } from '../../src'

describe('FetchQueue 资源获取队列', () => {
  jest.setTimeout(10_000)

  it('使用返回的task实例等待任务完成并获取结果', async () => {
    const queue = new FetchQueue()
    const task0 = queue.pushAction(async () => {
      await delay(1_000)
      return 1
    })
    const task1 = queue.pushAction(async () => {
      await delay(100)
      return 2
    })
    const r = await Promise.all([task0.res, task1.res])
    expect(r).toEqual([1, 2])
  })

  it('使用on监听队列空闲情况', async () => {
    const queue = new FetchQueue()
    let busy = false
    let callCount = 0
    queue.on('FETCH_QUEUE_IDLE_STATE_CHANGE', idle => {
      busy = !idle
      callCount += 1
    })
    // 单任务
    expect(busy).toBeFalsy()
    queue.pushAction(delayFn(100)) // push一个需要运行100ms的任
    expect(busy).toBeTruthy() // 这时队列变忙务
    expect(callCount).toBe(1) // 空闲变忙碌 触发一次
    await delay(300) // 等待300ms
    expect(busy).toBeFalsy() // 预期队列空闲
    expect(callCount).toBe(2) // 忙碌变空闲再次触发
    // 多任务
    const task1 = queue.pushAction(delayFn(300)) // 压入2个任务
    const task2 = queue.pushAction(delayFn(600))
    expect(busy).toBeTruthy()
    expect(callCount).toBe(3)
    await task1.res
    expect(busy).toBeTruthy() // 这时已经完成一个，但队列内还有一个依旧为忙碌
    expect(callCount).toBe(3) // 队列的工作中的任务数量从2个变成1个，但队列依旧不是空闲，所以不会触发回调，调用次数依旧为3
    await task2.res
    expect(busy).toBeFalsy() // 全部完成预期空闲
    expect(callCount).toBe(4)
  })

  it('限制最大并发数量', async () => {
    const queue = new FetchQueue(2) // 限制每次最多同时2个在运行
    const fns = Array.from({ length: 6 }).map(jest.fn)
    fns.forEach((_, i) => queue.pushAction(() => {
      fns[i]()
      return delay() // 加入宏队列
    }))
    // push完队列为空，直接运行0,1。 2345为未运行
    fns.slice(0, 2).forEach(i => expect(i).toBeCalled())
    fns.slice(2).forEach(i => expect(i).not.toBeCalled())
    await delay() // 等待上次并发运行完成，再完成本次的并发运行， 预期1，2，3，4都运行过
    fns.slice(0, 4).forEach(i => expect(i).toBeCalled())
    fns.slice(4).forEach(i => expect(i).not.toBeCalled())
    await delay() // 全部运行完成
    fns.forEach(i => expect(i).toBeCalled())
  })

  it('发生错误自动重试', () => {
    const queue = new FetchQueue(-1, -1, 0) // 不限制并发数量,不限制重试次数,重试间隔0
    let i = 0
    const { res } = queue.pushAction(() => {
      if (i++ < 2) {
        throw new Error()
      }
      return delay()
    })
    return res
  })

  it('指定重试间隔', async () => {
    const queue = new FetchQueue(-1, -1, 100) // 不限制并发数量,不限制重试次数,重试间隔100
    let i = 0
    const time: number[] = []
    const { res } = queue.pushAction(() => {
      if (i++ < 5) {
        time.push(Date.now())
        throw new Error()
      }
      return delay()
    })
    await res
    for (let i = 1; i < time.length; i++) {
      const l = time[i]
      const r = time[i - 1]
      const cond = l - r >= 100 - 10 // 在ci平台上跑时有时会出现99的情况,可能是因为精度问题，这边给出10的余量
      if (!cond) {
        console.error(JSON.stringify({ l, r, i, time }, null, 4))
      }
      expect(cond).toBeTruthy()
    }
    return res
  })


  it('等待直到队列为空', async () => {
    const queue = new FetchQueue()
    Array.from({ length: 5 }).forEach((_, i) => queue.pushAction(delayFn(100 * i)))
    await queue.waitUntilEmpty()
    expect(queue.isIdle).toBe(true)
  })
})
