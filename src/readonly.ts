import { Ref, ComputedRef } from 'vue'
export type { Ref }
export type DeepReadonly<T extends object> = {
  readonly [p in keyof T]:
    T[p] extends Ref<infer R>
      ? ComputedRef<R extends object ? DeepReadonly<R> : R> // Ref转成不可写的ComputedRef，不能直接使用DeepReadonly
      : T[p] extends object                                 // 不然watch和volar在unwrap时会出现问题
        ? T[p] extends Function                             // 函数不做处理，不然不给调用
            ? T[p]
            : DeepReadonly<T[p]>
        : T[p]
}

/**
 * 外部不可写
 */
export const deepReadonly = <T extends object> (v: T) => v as any as DeepReadonly<T>
