
import { deepComputedPick } from '../src'
import { nextTick, ref } from 'vue'
describe('deepComputedPick', () => {
  it('不会产生多余的字段', async () => {
    const model = ref({ a: 1, b: 2, c: 3 })
    const picked = deepComputedPick(model, ['a', 'b'])
    expect(picked.value.a).toBe(1)
    expect(picked.value.b).toBe(2)
    expect((picked.value as any).c).toBeUndefined()
  })

  it('双向同步', async () => {
    const model = ref({ a: 1, b: 2, c: 3 })
    const picked = deepComputedPick(model, ['a', 'b'])
    model.value.a++
    await nextTick()
    expect(picked.value.a).toBe(2)
    picked.value.a++
    await nextTick()
    expect(model.value.a).toBe(3)
  })

})
