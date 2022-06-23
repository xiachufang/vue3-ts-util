/* eslint-disable no-plusplus */
import { delay, useStrictQueue } from '../../src'

describe('useFetchQueueHelper', () => {

  it('套层皮的简单综合测试', async () => {
    const { run, loading } = useStrictQueue()
    expect(loading.value).toBe(false)
    const r = run(async () => {
      await delay(100)
      return 1
    })
    expect(loading.value).toBe(true)
    expect(await r).toBe(1)
    expect(loading.value).toBe(false)
  })
})
