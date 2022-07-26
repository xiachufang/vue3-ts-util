/* eslint-disable @typescript-eslint/ban-types */
import { debounce, isNumber, noop } from 'lodash'
import { Ref, ref, watch, watchEffect } from 'vue'
import { identity, clone } from 'ramda'
import { LocalComputed, DeepComputedConf, defaultConf } from './deepComputed'

/**
 * 能够确保进行深度嵌套对象或数组修改时，依旧使用set进行提交的computed。
 *
 * 遵循 getter依赖改变时候更新返回值，对返回值进行修改时调用setter，尽量少的不必要调用
 *
 * 可以在保证flux架构的理念下减少中间变量的产生，以及外部数据变化时的手动管理
 * @param setget 和vue的computed一样
 * @param conf deepComputed的配置。克隆， set get 的debounce
 */
export const deepComputedEffect = <T> (setget: LocalComputed<T>, conf: Omit<DeepComputedConf, 'proxy'> = {}) => {
  const get = typeof setget === 'function' ? setget : setget.get
  const set = typeof setget === 'function' ? noop : setget.set
  let enableFeedback = true
  const localValue = ref<T>()
  const { enableClone, debounceSet, debounceGet } = { ...defaultConf, ...conf }
  const cloneOrRaw = enableClone ? clone : identity
  const rawFeedBackFunc = () => {
    set(cloneOrRaw(localValue.value))
  }
  const feedback = isNumber(debounceSet) ? debounce(rawFeedBackFunc, debounceSet) : rawFeedBackFunc
  {
    const rawGetterWatchFunc = (v: T) => {
      enableFeedback = false // 外部getter更新时，关闭反馈
      localValue.value = cloneOrRaw(v) // 我们内部更新时阻止setter的调用，防止相互递归栈溢出
      enableFeedback = true
    }
    const getterWatchFn = isNumber(debounceGet) ? debounce(rawGetterWatchFunc, debounceGet) : rawGetterWatchFunc
    let getterCallTimes = 0
    // watchEffect, 立即调用用于初始化
    watchEffect(() => {
      // 强制第一次调用使用原始的函数
      // 避免debounce后同步代码获取不到
      if (++getterCallTimes === 1) {
        rawGetterWatchFunc(get())
      } else {
        getterWatchFn(get())
      }
    })
  }
  {
  /**
   * 反馈触发器，在改变时触发反馈
   * 用于将单tick内的所有需要对feedback的调用合并到一次
   */
    const feedbackTrigger = ref(0)
    watch(feedbackTrigger, feedback)
    watch(localValue, () => {
       // enableFeedback，在外部依赖修改时会是false，
       // 因为flush: 'sync'，那边修改localValue这边也会同步触发，然后被忽略掉
       // 其他对localValue的深度修改就使用feedbackTrigger推迟到tick结束调用feedback
      if (enableFeedback) {
        feedbackTrigger.value++ // 触发反馈
      }
    }, { deep: true, flush: 'sync' })
  }
  return localValue as Ref<T>
}
