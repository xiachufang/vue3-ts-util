import { ref } from 'vue'
import { FetchQueue } from '.'
import { deepReadonly } from './readonly'

/**
 *
 * @returns 严格队列，默认不允许重试，不允许并发，发生错误直接抛异常
 */
export const strictQueue = (args: ConstructorParameters<typeof FetchQueue> = [1, 0, -1, 'throw']) => {
  const fetchQueue = new FetchQueue(...args)
  const loading = ref(false)
  fetchQueue.on('FETCH_QUEUE_IDLE_STATE_CHANGE', v => {
    loading.value = !v
  })
  return deepReadonly({
    fetchQueue,
    loading
  })
}
