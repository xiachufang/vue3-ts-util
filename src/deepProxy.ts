import type { Ref } from 'vue'
import { deepComputedEffect } from './deepComputedEffect'

/**
 * defineModel对object不能深度响应
 *
 * 用这个
 * ```ts
 * const _expr = defineModel()
 * const expr = deepProxy(_expr) // 然后只用这个
 * ```
 *，相当于给defineModel添加了deep: true
 */
export const deepProxy = <T>(val: Ref<T>) => {
  return deepComputedEffect({
    get: () => val.value,
    set: v => val.value = v
  })
}
