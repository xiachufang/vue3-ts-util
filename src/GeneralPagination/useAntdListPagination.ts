import { computed, reactive, onMounted, ref } from 'vue'
import { makeAsyncIterator, PageCursor } from '..'
import { deepReadonly } from '../readonly'

export const useAntdListPagination = <T extends { cursor: PageCursor }, R> (fn: (cursor: string) => Promise<T>, resp2res: (resp: T) => R, pageSize = 10, initRes = true) => {
  const { res, next, loading, cursorStack, reset: resetUpstream } = makeAsyncIterator(fn, resp2res)
  let lastCurr = 1
  const curr = ref(1)
  const setCurr = (v: number) => {
    lastCurr = curr.value
    curr.value = v
  }
  const onChange = async (page: number) => {
    try {
      await next(page - 1) // loading,load不用管，但是网络异常还是要处理下
    } catch (error) {
      setCurr(lastCurr) // 发生网络错误回到刚才的页面
      throw error
    }
  }
  const pagination = reactive({
    onChange,
    total: computed(() => cursorStack.length * pageSize),
    pageSize,
    curr: computed(() => curr.value),
    setCurr
  })
  initRes && onMounted(next)
  const reset: typeof resetUpstream = (...args) => {
    setCurr(1)
    return resetUpstream(...args)
  }
  return deepReadonly({
    pagination,
    loading,
    res,
    reset
  })
}

export type PaginationOption = ReturnType<typeof useAntdListPagination>['pagination']
