import { R } from '..'
import { computed } from 'vue'
import { Ref } from '../readonly'
// todo 编译完类型全部丢失
export { default as SearchSelect } from './index.vue'
import { SearchSelectConv, OptionFragment, Props } from './typedef'
export * from './typedef'

export const defaultConv: SearchSelectConv<any> = {
  key: R.identity,
  value: R.identity,
  optionText: R.identity,
  text: R.identity
}

export const useOptionsComputed = (props: Props, searchTarget: Ref<string>) => {
  const currOptions = computed(() => {
    const { options, conv } = props
    if (!searchTarget.value) {
      return options.map<OptionFragment>((op, idx) => ({
        src: op,
        key: conv.key(op, idx),
        label: conv.optionText(op).toString(),
        title: conv.text(op).toString(),
        value: conv.value(op)
      }))
    }
    return options
      .reduce<OptionFragment[]>((p, c, cIdx) => {
      const srcText = conv.optionText(c).toString()
      const idx = srcText
        .toLowerCase()
        .indexOf(searchTarget.value.toLowerCase()) // 无视大小写，速度比比正则式快
      const lenTarget = searchTarget.value.length
      if (idx !== -1) {
        const frag: OptionFragment['frag'] = [
          srcText.substring(0, idx),
          srcText.substring(idx, idx + lenTarget),
          srcText.substring(idx + lenTarget)
        ]
        p.push({
          frag,
          src: c,
          key: conv.key(c, cIdx),
          title: conv.text(c).toString(),
          label: (
            <div>
              <span>{frag[0]}</span>
              <span style={{ color: 'red' }}>{frag[1]}</span>
              <span>{frag[2]}</span>
            </div>
          ),
          value: conv.value(c)
        })
      }
      return p
    }, [])
      .sort((a, b) => a.frag![0].length - b.frag![0].length) // 按搜索的关键字出现顺序，排序
  })
  return {
    currOptions
  }
}
