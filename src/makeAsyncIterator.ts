import { PageCursor } from './typedef'
import { reactive, ref } from 'vue'
import { ok } from '.'
import { deepReadonly } from './readonly'

/**
 * 创建异步迭代器
 * 分页资源获取,不需要手动管理cursor的迭代
 * @param fn 资源获取函数
 * @param resp2res 响应体转获取额资源
 * @returns 。。。
 */
export const makeAsyncIterator = <T extends { cursor: PageCursor }, R> (resFetch: (cursor: string) => Promise<T>, resp2res: (resp: T) => R) => {
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
    try {
      let nextCursorStr
      if (typeof idx === 'number') {
        nextCursorStr = cursorStack[idx]
        if (typeof nextCursorStr !== 'string') {
          return false
        }
      } else {
        nextCursorStr = cursorStack[cursorStack.length - 1]
      }
      const resp = await resFetch(nextCursorStr)
      res.value = resp2res(resp)
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
      loading.value = false
    }
    return true
  }
  /**
   * 重置当前的资源管理
   *
   * 经常是由一个分页器管理多个资源的获取，
   * 多种资源对应的光标增长序列不一样
   * 因此为了避免传的cursor错误，在从一种资源的获取切向另外一种之前需要手动调用重置下
   */
  const reset = async (reFetch?: boolean) => {
    ok(!loading.value)
    cursorStack.splice(0, cursorStack.length, '')
    loading.value = false
    res.value = undefined
    load.value = false
    reFetch && await next()
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
