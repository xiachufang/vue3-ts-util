import { pick } from 'lodash-commonjs-es'
import type { Ref } from 'vue'
import { deepComputedEffect } from './deepComputedEffect'

/* 从一个大的Ref model中提取出部分键组成一个新的深度计算值，该计算值与大model为双向同步。适用于于拆分model的场合
* @param model 从model
* @param keys 要提取的键
* @returns 一个新的深度计算值
*/
export const deepComputedPick = <T extends object, Keys extends (keyof T)[]>
  (model: Ref<T>, keys: Keys) => deepComputedEffect<Pick<T, Keys[number]>>({
    get: () => pick(model.value, keys),
    set: v => Object.assign(model.value, v)
  })
