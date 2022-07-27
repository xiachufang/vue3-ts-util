
import { deepComputedEffect, delay } from '../src'
import { nextTick, ref } from 'vue'
const noop = () => undefined
describe('deepComputedEffect', () => {
  it('响应object1层的修改', async () => {
    const upstream = ref({ val: 0 })
    let retVal: { val: number } = { val: -1 }
    const counter = deepComputedEffect({
      get: () => upstream.value,
      set: v => {
        retVal = v
      }
    })
    counter.value.val++
    await nextTick()
    expect(retVal.val).toBe(1)
  })

  it('响应array 2层的修改', async () => {
    const upstream = ref([{ val: 0 }, { val: 3 }])
    let retVal: { val: number }[] = [{ val: -1 }, { val: 2 }]
    const counter = deepComputedEffect({
      get: () => upstream.value,
      set: v => (retVal = v)
    })
    counter.value[0].val++
    await nextTick()
    expect(retVal[0].val).toBe(1)
    counter.value.push({ val: 2333 })
    await nextTick()
    expect(retVal.length).toBe(3)
    expect(retVal[2].val).toBe(2333)
    counter.value[2].val = 666
    await nextTick()
    expect(retVal[2].val).toBe(666)
  })

  it('响应.value的修改', async () => {
    const upstream = ref(1)
    let retVal = -1
    const counter = deepComputedEffect({
      get: () => upstream.value,
      set: v => (retVal = v)
    })
    counter.value++
    await nextTick()
    expect(retVal).toBe(2)
  })

  it('单tick内只调用一次setter', async () => {
    const upstream = ref(0)
    const fn = jest.fn()
    const counter = deepComputedEffect({
      get: () => upstream.value,
      set: fn
    })
    expect(fn).toBeCalledTimes(0)
    for (let i = 0; i < 100; i++) {
      counter.value++
    }
    await nextTick()
    expect(fn).toBeCalledTimes(1)
    counter.value++
    counter.value++
    await nextTick()
    expect(fn).toBeCalledTimes(2)
  })

  it('不会相互递归', async () => {
    const upstream = ref(0)
    const counter = deepComputedEffect({
      get: () => upstream.value,
      set: v => {
        upstream.value = v
      }
    })
    counter.value = 1
    await nextTick()
    expect(upstream.value).toBe(1)
    upstream.value = 2
    await nextTick()
    expect(counter.value).toBe(2)
    expect(upstream.value).toBe(2)
  })


  it('外部更新时不调用setter', async () => {
    const upstream = ref(0)
    const fn = jest.fn()
    const getterfn = jest.fn()
    deepComputedEffect({
      get: () => {
        getterfn()
        return upstream.value
      },
      set: fn
    })
    await nextTick()
    expect(getterfn).toBeCalledTimes(1)
    upstream.value++
    await nextTick()
    expect(fn).not.toHaveBeenCalled()
  })

  it('断开引用', async () => {
    const res = ref({ val: 0 })
    const counter = deepComputedEffect({
      get: () => res.value,
      set: noop
    })
    counter.value.val++
    await nextTick()
    expect(counter.value.val).toEqual(1)
    expect(res.value.val).toBe(0)
  })

  it('外部引用变化自动更新 - one tick', async () => {
    // 外部引用变化的下个tick更新
    const res = ref(0)
    const counter = deepComputedEffect({
      get: () => ({ val: res.value }),
      set: noop
    }) // 默认关闭节流
    expect(counter.value.val).toEqual(0)
    res.value = 1
    await nextTick()
    expect(counter.value.val).toEqual(1)
    res.value = 2
    await nextTick()
    expect(counter.value.val).toEqual(2)
  })

  it('外部引用变化自动更新 - one tick - 单函数写法', async () => {
    // 外部引用变化的下个tick更新
    const res = ref(0)
    const counter = deepComputedEffect(() => ({ val: res.value })) // 默认关闭节流
    expect(counter.value.val).toEqual(0)
    res.value = 1
    await nextTick()
    expect(counter.value.val).toEqual(1)
  })

  it('外部引用变化自动更新 - 节流', async () => {
    // one tick的节流版本
    const res = ref(0)
    const counter = deepComputedEffect({
      get: () => ({ val: res.value }),
      set: noop
    }, {
      debounceGet: 50
    })
    expect(counter.value.val).toEqual(0)
    res.value = 1
    await delay(100)
    expect(counter.value.val).toEqual(1)
    res.value = 2
    res.value = 1
    res.value = 2
    await delay(100)
    expect(counter.value.val).toEqual(2)
  })
})
