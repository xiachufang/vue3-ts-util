import { ref, onBeforeUnmount, onMounted } from 'vue'
import { ok } from '.'
import { deepReadonly, Ref } from './readonly'

export const useDomRect = <T extends Element, K extends string> (eleRef: Ref<T | undefined>, key?: K) => {
  const rect = ref<DOMRect>()
  const ro = new ResizeObserver(entries => {
    rect.value = entries[0].target.getBoundingClientRect()
  })
  onMounted(() => {
    const ele = eleRef.value
    ok(ele)
    ro.observe(ele)
  })
  onBeforeUnmount(() => {
    ro.disconnect()
  })
  const refKey = key || 'eleRef'
  return deepReadonly({
    [refKey]: eleRef,
    rect
  })
}
