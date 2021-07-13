import { computed, reactive, onMounted } from 'vue'
import { makeAsyncIterator, PageCursor } from '.'
import { deepReadonly } from './readonly'

export const useAntdListPagination = <T extends { cursor: PageCursor }, R> (fn: (cursor: string) => Promise<T>, resp2res: (resp: T) => R, pageSize = 10, initRes = true) => {
  const { res, next, loading, cursorStack, reset } = makeAsyncIterator(fn, resp2res)
  const onChange = (page: number) => next(page - 1)
  const total = computed(() => cursorStack.length * pageSize)
  const pagination = reactive({
    onChange,
    total,
    pageSize
  })
  initRes && onMounted(next)
  return deepReadonly({
    pagination,
    loading,
    res,
    reset
  })
}
