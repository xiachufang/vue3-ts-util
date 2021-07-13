
import { EventEmitter } from 'events'
import { onBeforeUnmount } from 'vue'
/**
 * TypeStrong 的EventEmitter
 */

 interface TypedEventEmiter<EventKV extends Record<string, any>, Keys extends keyof EventKV = keyof EventKV> {
  once<K extends Keys> (k: K, fn: (v: EventKV[K]) => void): void
  on<K extends Keys> (k: K, fn: (v: EventKV[K]) => void): void
  off<K extends Keys> (k: K, fn: (v: EventKV[K]) => void): void
  emit<K extends Keys, V = EventKV[K]> (k: K, ...args: V extends undefined ? [] : [v: V]): void
  removeAllListeners (k?: Keys): void
}
export const typedEventEmiter = <EventKV extends Record<string, any>> () => {
  type Keys = keyof EventKV
  const eventEmiter = new EventEmitter() as TypedEventEmiter<EventKV> & Omit<EventEmitter, 'once' | 'on' | 'off' | 'emit' | 'removeAllListeners'>

  /**
   * 带RAII的事件监听
   */
  const useEventListen = <K extends Keys> (e: K, fn: (v: EventKV[K]) => any) => {
    eventEmiter.on(e, fn)
    onBeforeUnmount(() => eventEmiter.off(e, fn))
  }

  return {
    eventEmiter,
    useEventListen
  }
}
