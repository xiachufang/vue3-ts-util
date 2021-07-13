export type Ref<T> = { value: T }
export type DeepReadonly<T> = {
  readonly [p in keyof T]:
    T[p] extends Ref<infer R>
      ? DeepReadonly<Ref<R>>
      : T[p]
}

export const deepReadonly = <T> (v: T) => v as any as DeepReadonly<T>
