import { createApp, defineComponent, h } from 'vue'
import { createTypedShareStateHook, momentConvert } from '../src'

const { useHookShareState } = createTypedShareStateHook(() => ({
  count: 0
}))

const useCountIncr = () => {
  const { state } = useHookShareState()
  state.count++
}

const render = () => h('div')

describe('createTypedShareStateHook', () => {

  it('修改hook后会变化', () => {
    let count = -1
    createApp(defineComponent({
      render,
      setup () {
        useCountIncr()
        const { state } = useHookShareState()
        count = state.count
      }
     })).mount(document.createElement('div'))
     expect(count).toBe(1)
  })

  it('修改hook后会变化(refs形式) & 不同实例之间互不干扰', () => {
    let count = -1
    createApp(defineComponent({
      render,
      setup () {
        useCountIncr()
        const { count: countR } = useHookShareState().toRefs()
        count = countR.value
      }
     })).mount(document.createElement('div'))
     expect(count).toBe(1)
  })

})
