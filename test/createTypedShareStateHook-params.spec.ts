import { computed, createApp, defineComponent, h, ref } from 'vue'
import { createTypedShareStateHook, dayjsConvert } from '../src'

const { useHookShareState } = createTypedShareStateHook((inst, params) => ({
  str: params
}), () => 'hello')

const render = () => h('div')

function useStrChange () {
  const { state } = useHookShareState()
  state.str += ' world'
}



describe('createTypedShareStateHook - 运行时参数传入', () => {


  it('文档例子', () => {
    createApp(defineComponent({
      render,
      setup () {
        const paramsInit = () => ({ total: 1 })
        const { useHookShareState } = createTypedShareStateHook((inst, params) => {
          const count = ref(0)
          return {
            count,
            overTotal: computed(() => count.value > params.total)
          }
        }, paramsInit)

        const { state } = useHookShareState({ total: 4 }) // 仅第一个useHookShareState的有效，不传fallback到paramsInit
        state.count = 5
        expect(state.overTotal).toBe(true)
      }
    })).mount(document.createElement('div'))
  })


  it('使用默认参数 - 修改后实例内状态会变化 - ', () => {
    let str = ''
    createApp(defineComponent({
      render,
      setup () {
        useStrChange()
        const { state } = useHookShareState()
        str = state.str
      }
    })).mount(document.createElement('div'))
    expect(str).toBe('hello world')
  })

  it('使用useHookShareState传入参数 -修改后实例内状态会变化(refs形式) & 不同实例之间互不干扰', () => {
    let str = ''
    createApp(defineComponent({
      render,
      setup () {
        const { str: strr } = useHookShareState('ciallo').toRefs()
        useStrChange()
        str = strr.value
      }
    })).mount(document.createElement('div'))
    expect(str).toBe('ciallo world')
  })

})
