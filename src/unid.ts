import { ok } from '.'

export const idKey = Symbol('全局唯一id')
export const unid = () => Symbol('id')
export interface UniqueId {
  readonly [idKey]: symbol;
}

export type WithId<T> = T extends UniqueId ? T : T & UniqueId

export const ID = <T>(obj: T, ignoreGenerated = false) => {
  const a = obj as WithId<T>
  if (a[idKey] && ignoreGenerated) {
    return a
  }
  ok(!a[idKey], '此对象已生成过id');
  (a[idKey] as symbol) = unid()
  return a
}

/**
 * 返回一个固定类型的id生成器
 * 一些复杂的情况，ID函数无法从上下文进行类型推导，使用这个函数先进行类型的固定
 */
export const typedID = <T>(ignoreGenerated = false) => (v: T) => ID(v, ignoreGenerated)
