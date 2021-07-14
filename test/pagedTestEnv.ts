import { delay, PageCursor } from '../src'

/**
 * 分页资源测试环境，所有的测试环境都应该使用纯函数写，确保无副作用
 */
 export const pagedResourceTestEnv = (length = 10, delayTime = 0) => {
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
