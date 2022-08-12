import { ColumnProps } from 'ant-design-vue/lib/table/interface'
import type { ActionContext } from 'vuex'
import type { Obj, Fn, ActionContextInfer } from 'vuex-dispatch-infer'

export type Columns<T> = (Omit<ColumnProps, 'customRender'> & {
  customRender?: (a: { record: T }) => any
  dataIndex?: keyof T,
  slots?: {
    customRender: string
  }
})[]

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ActionInfer<State, Commit extends Obj<Fn>> = ActionContext<State, any> & ActionContextInfer<Commit>


export type WithRequired<T, K extends keyof T> = T & { [P in K]-?: T[P] }

export interface PageCursor {
  has_next: boolean
  has_prev: boolean
  next_cursor: string
  prev_cursor: string
  next: string
  prev: string
}

export interface Image {
  ident: string
  original_width: number
  original_height: number
  max_width: number
  data_url?: string
  max_height: number
  url_pattern: string
}
