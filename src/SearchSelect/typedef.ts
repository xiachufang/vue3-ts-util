import { VNode } from 'vue'

export type SearchSelectConv<T> = {
  key(v: T, idx: number): string | number
  value(v: T): string | number
  optionText(v: T): string | number
  text(v: T): string | number
}

export interface OptionFragment {
  src: string
  key: string | number
  value: string | number
  title: string
  label: VNode | string | number
  frag?: [string, string, string]
}
export interface Props {
  value: unknown
  mode: 'multiple' | undefined
  options: any[]
  conv: SearchSelectConv<any>
}

