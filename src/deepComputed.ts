/* eslint-disable @typescript-eslint/ban-types */
import { debounce, isFunction, isObject, noop } from 'lodash'
import { Ref, ref, watch } from 'vue'
import { R } from '.'

type LocalComputed<T> = {
  get: () => T,
  set: (v: T) => any
} | (() => T)
type Path = (string | symbol | number)[]
type DeepComputedConf = {
  proxy?: (target: any, p: Path, value: any, receiver: any) => void
  enableClone?: boolean
  debounceSet?: number
  debounceGet?: number
  proxyDeep?: number
  ignoreArrayDeepIncr?: boolean
}

const defaultConf = {
  enableClone: true,
  proxyDeep: 1,
  ignoreArrayDeepIncr: true
}
/**
 * 能够确保进行深度嵌套对象或数组修改时，依旧使用set进行提交的computed。
 * 可以在保证flux架构的理念下减少中间变量的产生，以及外部数据变化时的手动管理
 *
 * 出于性能考虑，监听的深度在目标是object时是1层:[keyof T]，array是2层[number, keyof T[number]]
 *
 * 实现原因.value外部不可修改, 如有需要修改的情况推荐直接使用deepComputed参数里的set(val)函数代替，反正没有中间变量
 *
 * @param arg0 和vue的computed一样
 * @param conf deepComputed的配置。其中proxy和ProxyHandler<T>['set']类似，用于观察数据的变化 。例如用来debug @example (_, path, v) => console.log(path, v)
 */
export const deepComputed = <T extends object> (setget: LocalComputed<T>, conf: DeepComputedConf = {}) => {
  const get = typeof setget === 'function' ? setget : setget.get
  const set = typeof setget === 'function' ? noop : setget.set
  const localValue = ref()
  const { proxy, enableClone, debounceSet, debounceGet, proxyDeep, ignoreArrayDeepIncr } = { ...defaultConf, ...conf }
  const cloneOrRaw = enableClone ? R.clone : R.identity
  const rawFeedBackFunc = () => set(cloneOrRaw(localValue.value))
  const feedback = debounceSet ? debounce(rawFeedBackFunc, debounceSet) : rawFeedBackFunc
  const proxyedMark = Symbol('proxyed')
  const preventFeedbackMark = Symbol('preventFeedback')
  const createHandler = <T extends object> (extraPath: Path, deep: number) => {
    const handler: ProxyHandler<T> = {
      set (target, p, value, receiver) {
        if (isObject(target[p])) {
          target[p][preventFeedbackMark] = true
        }
        const r = Reflect.set(target, p, proxyObject(value, extraPath, deep), receiver)
        if (!target[preventFeedbackMark]) {
          feedback() // 代理对象set时调用Computed里的set
          proxy && proxy(target, [...extraPath, p], value, receiver)
        }
        return r
      }
    }
    return handler
  }
  const proxyObject = <T> (obj: any, path: Path, deep = 0): T => {
    if (deep > proxyDeep || !isObject(obj) || obj[proxyedMark]) { // 已经代理过我们跳过，因为同一个symbol，表示feedback的回调也是同一个
      return obj
    }
    if (obj instanceof Array) {
      obj = obj.map((v, idx) => proxyObject(v, [...path, idx]), deep + (ignoreArrayDeepIncr ? 0 : 1))
    } else {
      for (const key in obj) {
        const val = obj[key]
        if (typeof val === 'object') {
          obj[key] = proxyObject(val, [...path, key], deep + 1)
        }
      }
    }
    obj[proxyedMark] = true
    obj[preventFeedbackMark] = false
    return new Proxy(obj, createHandler(path, deep))
  }
  localValue.value = proxyObject(cloneOrRaw(get()), [])
  const rawWatchFunc = (v: T) => (localValue.value = proxyObject(cloneOrRaw(v), []))
  const watchFunc = debounceGet ? debounce(rawWatchFunc, debounceGet) : rawWatchFunc
  watch(get, watchFunc)
  return localValue as Readonly<Ref<T>>
}
