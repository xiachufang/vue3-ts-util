import * as R from 'ramda'
import { computed } from 'vue'
import { Ref } from '../readonly'
// todo 编译完类型全部丢失
export { default as SearchSelect } from './index.vue'
import { OptionFragment, Props, StrOrNum } from './typedef'
import { isNil } from 'lodash-commonjs-es'
export * from './typedef'

const check = (val: StrOrNum, op: any, idx: number, field: string) => {
  if (isNil(val)) {
    console.error({ op, idx, field, val })
    throw new Error(`Conversion error, result is null or undefined, field: ${field}, index: ${idx}.`)
  }
  return val
}
export const useOptionsComputed = (props: Props, searchTarget: Ref<string>) => {
  const currOptions = computed(() => {
    const { options, conv } = props
    const key = conv.key ?? conv.value
    const optionText = conv.optionText ?? conv.text
    if (!searchTarget.value) {
      return options.map<OptionFragment>((op, idx) => ({
        src: op,
        key: check(key(op, idx), op, idx, 'key'),
        label: check(optionText(op), op, idx, 'label').toString(),
        title: check(conv.text(op), op, idx, 'title').toString(),
        value: check(conv.value(op), op, idx, 'value')
      }))
    }
    return options
      .reduce<OptionFragment[]>((p, c, cIdx) => {
      const srcText = optionText(c).toString()
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
          key: key(c, cIdx),
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
