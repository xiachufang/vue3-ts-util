import { ref } from 'vue'
import { deepReadonly } from '.'


export const promise2ref = <T> (promsie: Promise<T>) => {
  const r = ref<T>()
  promsie.then(v => (r.value = v))
  return deepReadonly(r)
}
