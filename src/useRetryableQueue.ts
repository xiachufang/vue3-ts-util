import { FetchQueue, useFetchQueueHelper } from '.'

export const useRetryableQueue = () => useFetchQueueHelper(new FetchQueue())
