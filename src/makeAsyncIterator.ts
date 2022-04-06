import { PageCursor } from './typedef'
import { reactive, ref } from 'vue'
import { ok } from '.'
import { deepReadonly } from './readonly'
import { assigIncrId } from './incrId'

export type ResetParams = {
  refetch?: boolean
  force?: boolean
}

/**
 * 创建异步迭代器
 * 分页资源获取,不需要手动管理cursor的迭代
 * @param resFetch 资源获取函数
 * @param resp2res 响应体转获取额资源
 * @returns
 */
export const makeAsyncIterator = <T extends { cursor: PageCursor }, R> (resFetch: (cursor: string) => Promise<T>, resp2res: (resp: T) => R,
  { dataUpdateStrategy = 'replace' }: { dataUpdateStrategy?: 'merge' | 'replace' } = {}) => {
  const cursorStack = reactive<string[]>([''])
  /**
   * 所有资源加载完成
   */
  const load = ref(false)
  /**
   * 当前迭代到的资源
   */
  const res = ref<R>()
  /**
   * 加载中
   */
  const loading = ref(false)

  let currActionId = ref(-1)

  const abortActions = new Set<number>()

  const updateRes = (newVal: R) => {
    if (dataUpdateStrategy === 'replace') {
      res.value = newVal
    } else if (dataUpdateStrategy === 'merge') {
      ok((Array.isArray(res.value) || typeof res.value === 'undefined') && Array.isArray(newVal), '数据更新策略为合并时仅可用于值为数组的情况')
      res.value = [...(res?.value ?? []), ...newVal] as any
    }
  }

  /**
   * 资源获取迭代到下一页，或者是指定页
   * @param idx 指定页 0开始，默认下一页
   * @returns bool 指示操作是否成功
   */
  const next = async (idx?: number) => {
    if (loading.value || // next应该由外部世界确保不被调用，资源迭代是互斥的
      (load.value && typeof idx === 'undefined')) { // 如果不是进行随机访问，那在全部加载完成时失败
      return false
    }
    loading.value = true
    const thisActionId = assigIncrId()
    try {
      currActionId.value = thisActionId // 标记当前正在运行的是哪个action
      let nextCursorStr: string
      if (typeof idx === 'number') {
        nextCursorStr = cursorStack[idx]
        if (typeof nextCursorStr !== 'string') {
          return false
        }
      } else {
        nextCursorStr = cursorStack[cursorStack.length - 1]
      }
      const resp = await resFetch(nextCursorStr)
      if (abortActions.has(thisActionId)) {
        abortActions.delete(thisActionId)
        return false
      }
      updateRes(resp2res(resp))
      const newCursor = resp.cursor
      if (idx === cursorStack.length - 1 || typeof idx !== 'number') { // 在最后一页向前时，光标栈才压入
        load.value = !newCursor.has_next
        if (newCursor.has_next) {
          const next = newCursor.next_cursor || newCursor.next
          ok(typeof next === 'string')
          cursorStack.push(next)
        }
      }
    } finally {
      if (currActionId.value === thisActionId) { // 当不一致时，说明被中断掉了，不进行操作
        loading.value = false
      }
    }
    return true
  }

  /**
   * 中断当前的迭代操作
   */
  const abort = () => {
    abortActions.add(currActionId.value)
    loading.value = false
  }

  /**
   * 重置当前的资源管理
   *
   * 经常是由一个分页器管理多个资源的获取，
   * 多种资源对应的光标增长序列不一样
   * 因此为了避免传的cursor错误，在从一种资源的获取切向另外一种之前需要手动调用重置下
   */
  const reset = async (params: ResetParams | boolean = false) => {
    const { refetch, force } = typeof params === 'object' ? params : <ResetParams>{ refetch: params }
    if (force) {
      abort()
    } else {
      ok(!loading.value)
    }
    cursorStack.splice(0, cursorStack.length, '')
    loading.value = false
    res.value = undefined
    load.value = false
    refetch && await next()
  }

  const asyncIter = () => {
    return {
      next: async () => {
        await next()
        return {
          done: load.value,
          value: res.value
        }
      }
    }
  }

  return deepReadonly({
    abort,
    load,
    next,
    res,
    loading,
    cursorStack,
    reset,
    [Symbol.asyncIterator]: asyncIter,
    iter: {
      [Symbol.asyncIterator]: asyncIter
    }
  })
}
