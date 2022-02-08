import { onBeforeUnmount } from 'vue'

export const useWatchDocument = <K extends keyof DocumentEventMap> (...args: [key: K, cb:(this: Document, ev: DocumentEventMap[K]) => any, options?:boolean | EventListenerOptions | undefined]): void => {
  document.addEventListener(...args)
  onBeforeUnmount(() => document.removeEventListener(...args))
}
