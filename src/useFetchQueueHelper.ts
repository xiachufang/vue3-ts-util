import { ref } from 'vue'
import { FetchQueue, deepReadonly } from '.'

export const useFetchQueueHelper = (fetchQueue: FetchQueue) => {
  const loading = ref(!fetchQueue.isIdle)
  fetchQueue.on('FETCH_QUEUE_IDLE_STATE_CHANGE', v => {
    loading.value = !v
  })
  return {
    fetchQueue,
    async run<R> (action: () => Promise<R>): Promise<R> {
      return fetchQueue.pushAction(action).res
    },
    ...deepReadonly({
      loading,
    })
  }
}
