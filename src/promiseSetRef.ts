import type { Ref } from '.'

/**
 * promise resolved后给ref设置上
 */
export const promiseSetRef = async <T> (promise: Promise<T>, ref: Ref<T>) => {
  const v = await promise
  return (ref.value = v)
}
