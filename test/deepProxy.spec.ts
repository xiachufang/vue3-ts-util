import { computed } from 'vue'
import { deepProxy, delay } from '../src'

describe('deepProxy', () => {

  it('深度响应', async () => {
    {

      const fn = jest.fn()
      const a = computed({
        get: () => ({ count: 1 }),
        set: fn
      })
      a.value.count ++
      await delay()
      expect(fn).not.toBeCalled()
    }
    {
      const fn = jest.fn()
      const a = deepProxy(computed({
        get: () => ({ count: 1 }),
        set: fn
      }))
      a.value.count ++
      await delay()
      expect(fn).toBeCalled()
    }
  })

})
