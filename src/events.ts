
import { EventEmitter } from 'eventemitter3'
import { onBeforeUnmount } from 'vue'
import { Fn } from 'vuex-dispatch-infer'
/**
 * TypeStrong 的EventEmitter
 */
export type TypedEventEmitter<EventKV extends Record<string, Fn>> = EventEmitter<EventKV>

export const typedEventEmitter = <EventKV extends Record<string, Fn>> () => {
  type Keys = keyof EventKV
  const eventEmitter = new EventEmitter<EventKV>()

  /**
   * 带RAII的事件监听
   */
  const useEventListen = <K extends Keys> (e: K, fn: EventKV[K]) => {
    eventEmitter.on(e as any, fn as any)
    onBeforeUnmount(() => eventEmitter.off(e as any, fn as any))
  }

  return {
    eventEmitter,
    useEventListen
  }
}

