import type { VNode } from 'vue'
import type { ActionContext } from 'vuex'
import type { Obj, Fn, ActionContextInfer } from 'vuex-dispatch-infer'

export interface ColumnProps {
    title: VNode;
    key: string | number
    align: "left" | "right" | "center"
    ellipsis: boolean
    sorter: any
    defaultSortOrder: "descend" | "ascend"
    colSpan: number;
    width: string | number
    fixed: boolean | "left" | "right"
    sortOrder: boolean | "descend" | "ascend"
    dataIndex: string
    slots: {
      customRender: string
    }
};


export type Columns<T> = (Partial<ColumnProps> & {
  customRender?: (a: { record: T }) => any
  dataIndex?: keyof T
})[]

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ActionInfer<State, Commit extends Obj<Fn>> = ActionContext<State, any> & ActionContextInfer<Commit>

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
