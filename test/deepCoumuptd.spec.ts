
import { deepComputed, delay } from '../src'
import { ref } from 'vue'
const noop = () => undefined
describe('deepCoumuptd', () => {
  it('响应object1层的修改', () => {
    const upstream = ref({ val: 0 })
    let retVal: { val: number } = { val: -1 }
    const counter = deepComputed({
      get: () => upstream.value,
      set: v => (retVal = v)
    })
    counter.value.val++
    expect(retVal.val).toBe(1)
  })

  it('响应array 2层的修改', () => {
    const upstream = ref([{ val: 0 }, { val: 3 }])
    let retVal: { val: number }[] = [{ val: -1 }, { val: 2 }]
    const counter = deepComputed({
      get: () => upstream.value,
      set: v => (retVal = v)
    })
    counter.value[0].val++
    expect(retVal[0].val).toBe(1)
    counter.value.push({ val: 2333 })
    expect(retVal.length).toBe(3)
    expect(retVal[2].val).toBe(2333)
    counter.value[2].val = 666
    expect(retVal[2].val).toBe(666)
  })

  it('断开引用', () => {
    const res = ref({ val: 0 })
    const counter = deepComputed({
      get: () => res.value,
      set: noop
    })
    counter.value.val++
    expect(counter.value.val).toEqual(1)
    expect(res.value.val).toBe(0)
  })

  it('外部引用变化自动更新 - one tick', async () => {
    // 外部引用变化的下个tick更新
    const res = ref(0)
    const counter = deepComputed({
      get: () => ({ val: res.value }),
      set: noop
    }) // 默认关闭节流
    expect(counter.value.val).toEqual(0)
    res.value = 1
    await delay()
    expect(counter.value.val).toEqual(1)
    res.value = 2
    await delay()
    expect(counter.value.val).toEqual(2)
  })

  it('外部引用变化自动更新 - one tick - 单函数写法', async () => {
    // 外部引用变化的下个tick更新
    const res = ref(0)
    const counter = deepComputed(() => ({ val: res.value })) // 默认关闭节流
    expect(counter.value.val).toEqual(0)
    res.value = 1
    await delay()
    expect(counter.value.val).toEqual(1)
  })

  it('外部引用变化自动更新 - 节流', async () => {
    // one tick的节流版本
    const res = ref(0)
    const counter = deepComputed({
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
