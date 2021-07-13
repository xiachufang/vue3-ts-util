import { onBeforeUnmount } from 'vue'

export const useWatchDocument = <K extends keyof DocumentEventMap> (...args: [K, (this: Document, ev: DocumentEventMap[K]) => any]): void => {
  document.addEventListener(...args)
  onBeforeUnmount(() => document.removeEventListener(...args))
}
