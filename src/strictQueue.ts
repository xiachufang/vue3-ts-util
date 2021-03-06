import type { ComputedRef } from 'vue'
import { FetchQueue, useFetchQueueHelper } from '.'

/**
 *
 * @returns 严格队列，默认不允许重试，不允许并发，发生错误直接抛异常
 */
export const strictQueue = (args: ConstructorParameters<typeof FetchQueue> = [1, 0, -1, 'throw']) => {
  const fetchQueue = new FetchQueue(...args)
  return useFetchQueueHelper(fetchQueue)
}
export const useStrictQueue = strictQueue
