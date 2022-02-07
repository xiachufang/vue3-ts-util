import { ok } from '.'
import { getCurrentInstance } from 'vue'

export const useEmit = () => {
  const vm = getCurrentInstance()
  ok(vm)
  const emitFactory = (event: string) => (...args: any[]) => vm.emit(event, ...args)
  return {
    emit: vm.emit,
    emitModel: emitFactory('update:modelValue'),
    emitValue: emitFactory('update:value')
  }
}
