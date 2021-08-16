
import { EventEmitter } from 'events'
import { onBeforeUnmount } from 'vue'
/**
 * TypeStrong 的EventEmitter
 */

export type TypedEventEmitter<EventKV extends Record<string, any>, Keys extends keyof EventKV = keyof EventKV> =
  Omit<EventEmitter, 'once' | 'on' | 'off' | 'emit' | 'removeAllListeners'> & ({
    once<K extends Keys> (k: K, fn: (v: EventKV[K]) => void): void
    on<K extends Keys> (k: K, fn: (v: EventKV[K]) => void): void
    off<K extends Keys> (k: K, fn: (v: EventKV[K]) => void): void
    emit<K extends Keys, V = EventKV[K]> (k: K, ...args: V extends undefined ? [] : [v: V]): void
    removeAllListeners (k?: Keys): void
  })

export const typedEventEmitter = <EventKV extends Record<string, any>> () => {
  type Keys = keyof EventKV
  const eventEmitter = new EventEmitter() as TypedEventEmitter<EventKV>

  /**
   * 带RAII的事件监听
   */
  const useEventListen = <K extends Keys> (e: K, fn: (v: EventKV[K]) => any) => {
    eventEmitter.on(e, fn)
    onBeforeUnmount(() => eventEmitter.off(e, fn))
  }

  return {
    eventEmitter,
    useEventListen
  }
}
