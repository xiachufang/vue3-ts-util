import { onBeforeUnmount } from 'vue'

/**
 * 带RAII的Object url分配
 */
export const useHeap = () => {
  const heap = new Array<string>()
  let buf = new WeakMap<any, string>()
  const alloc = (obj: any) => {
    if (buf.has(obj)) {
      return buf.get(obj)!
    }
    const ptr = URL.createObjectURL(obj)
    heap.push(ptr)
    buf.set(obj, ptr)
    return ptr
  }
  onBeforeUnmount(() => {
    heap.forEach(ptr => {
      URL.revokeObjectURL(ptr)
    })
    buf = new WeakMap()
  })
  return {
    alloc
  }
}
