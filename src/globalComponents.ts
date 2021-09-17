import type { SearchSelect, SplitView, GeneralPagination } from '.'
declare module 'vue' {
  export interface GlobalComponents {
    SearchSelect: typeof SearchSelect,
    SplitView: typeof SplitView,
    GeneralPagination: typeof GeneralPagination
  }
}
export {}
