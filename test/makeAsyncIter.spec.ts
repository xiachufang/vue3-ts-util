import { makeAsyncIterator, delay, PageCursor } from '../src'
/**
 * 分页资源测试环境，所有的测试环境都应该使用纯函数写，确保无副作用
 */
const pagedResourceTestEnv = (length = 10, delayTime = 0) => {
  const createResource = (length: number) => {
    const curs = ['']
    return Array.from({ length }).map<{ cursor: PageCursor, val: number, curr: string }>((_, i) => {
      if (i !== length - 1) {
        curs.push((Math.random() * 10000).toPrecision(4))
      }
      return {
        val: i,
        curr: curs[i],
        cursor: {
          has_next: i !== length - 1,
          next_cursor: curs[i + 1],
          prev_cursor: curs[i - 1] || '',
          next: curs[i + 1],
          prev: curs[i - 1] || '',
          has_prev: i !== 0
        }
      }
    })
  }
  const mockRes = createResource(length)
  const fetchRes = async (cursor: string) => {
    await delay(delayTime)
    const res = mockRes.find(v => v.curr === cursor)
    if (res) {
      return res
    }
    throw new Error('400 cursor error')
  }
  return {
    fetchRes,
    mockRes
  }
}

describe('makeAsyncIterator', () => {
  it('资源迭代获取', async () => {
    const { fetchRes } = pagedResourceTestEnv(3) // 创建一个3页的mock资源
    const { res, next, load } = makeAsyncIterator(fetchRes, resp => resp.val)
    expect(res.value).toBeFalsy()
    expect(await next()).toBeTruthy() // 可以正常迭代，返回true表示成功
    expect(res.value).toBe(0)
    expect(await next()).toBeTruthy() // 可以正常迭代，返回true表示成功
    expect(res.value).toBe(1)
    expect(await next()).toBeTruthy() // 可以正常迭代，返回true表示成功
    expect(res.value).toBe(2)
    expect(load.value).toBeTruthy() // 全部加载完成
    expect(await next()).toBeFalsy() // 已经到了最后一页，迭代失败，返回false
    expect(res.value).toBe(2) // 值不变
  })

  it('迭代中loading状态改变且互斥', async () => {
    const { fetchRes } = pagedResourceTestEnv(3, 100) // 创建一个3页的mock资源
    const { next, loading } = makeAsyncIterator(fetchRes, resp => resp.val)
    expect(loading.value).toBeFalsy() // 状态发生改变
    const firstIter = next() // 进行迭代
    expect(loading.value).toBeTruthy() // 状态发生改变
    expect(await next()).toBeFalsy() // 迭代失败， mutex，无法同时进行两个迭代，返回一个false
    await firstIter // 等待首次迭代完成
    expect(loading.value).toBeFalsy() // 迭代完成， loading变回去
  })

  it('使用next进行随机访问', async () => {
    const { fetchRes, mockRes } = pagedResourceTestEnv()
    const { next, iter, res } = makeAsyncIterator(fetchRes, resp => resp.val)
    for await (const _ of iter) { // 直接一次性迭代出所有资源, 随机范围只能在获取到的范围内
    }
    expect(await next(2)).toBeTruthy() // 随机访问第2页的资源
    expect(res.value).toBe(mockRes[2].val)
    expect(await next(5)).toBeTruthy() // 随机访问第5页的资源
    expect(res.value).toBe(mockRes[5].val)
    expect(await next(9)).toBeTruthy() // 随机访问第9页的资源
    expect(res.value).toBe(mockRes[9].val)
    expect(await next(999)).toBeFalsy() // 尝试访问一个不存在或者未知的资源会返回操作错误
  })

  it('使用reset进行单控制器多资源的管理', async () => {
    const resEnvSet = Array.from({ length: 3 }).map(() => pagedResourceTestEnv())
    let resEnvIdx = 0
    const { next, reset, res } = makeAsyncIterator(cur => resEnvSet[resEnvIdx].fetchRes(cur), resp => resp.val)
    expect(await next()).toBeTruthy()
    expect(res.value).toBe(0)
    resEnvIdx = 2 // 切向另外一种资源的获取
    await expect(next()).rejects.toThrow() // 直接迭代 服务器返回一个错误，因为不同资源的curosr增长序列不一样
    reset() // 正确办法是重置，让cursor序列重新增长
    expect(await next()).toBeTruthy()
    expect(res.value).toBe(0)
  })

  it('持续使用随机访问获取下一页迭代, (模拟antd分页器的翻页行为)', async () => {
    const { fetchRes } = pagedResourceTestEnv(5)
    const { next, load, res } = makeAsyncIterator(fetchRes, resp => resp.val)
    const resSet = new Array<any>()
    while (!load.value) {
      expect(await next(resSet.length)).toBeTruthy()
      resSet.push(res.value)
    }
  })
})
