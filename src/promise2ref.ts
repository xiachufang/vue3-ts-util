import { ref } from 'vue'
import { deepReadonly } from '.'


export const promise2ref = <T> (promise: Promise<T>) => {
  const r = ref<T>()
  promise.then(v => (r.value = v))
  return deepReadonly(r)
}
