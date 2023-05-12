import type { VNode } from 'vue'

export type StrOrNum = string | number

export type SearchSelectConv<T> = {
  /**
   * v-for的key，不传默认使用value
   */
  key?: (v: T, idx: number) => StrOrNum
  /**
   * v-model的值
   */
  value(v: T): StrOrNum
  /**
   * 选项显示的文本,不填默认使用text
   */
  optionText?: (v: T) => StrOrNum
  /**
   * 回填时显示的文本
   */
  text(v: T): StrOrNum
}

export interface OptionFragment {
  src: string
  key: StrOrNum
  value: StrOrNum
  title: string
  label: VNode | StrOrNum
  frag?: [string, string, string]
}
export interface Props {
  value: unknown
  options: any[]
  conv: SearchSelectConv<any>
  mode?: 'multipie'
}

