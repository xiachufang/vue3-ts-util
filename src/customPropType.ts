import { PropType } from 'vue'

/**
 * vue props用于推导自定义类型的辅助函数
 * @example
 * props: {
 *   seg: customPropsType<SegParams>(), // 非空，自定义接口
 *   getState: customPropsType<(id: number) => ArchState>(false), // 可空，函数
 *   enable: customPropsType<boolean>(false, Boolean) // 可空，运行时类型检查,
 *   direction: customPropType((): 'vertical' | 'horizontal' => 'horizontal') // 默认参数
 * }
 * @param required 参数必填 默认true
 * @param type 传入构造函数进行动态检查
 */
export function customPropType<T> (required?: true, type?: PropType<T>): { type: PropType<T>; required: true }
export function customPropType<T> (required: boolean, type?: PropType<T>): { type: PropType<T> }
export function customPropType<T> (factory: () => T): { type: PropType<T>; required: true }
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function customPropType (arg0: any = true, type?: any) {
  const res: any = {
    type: type || null // ts没办法通过在不传入参数的情况下，通过泛型实现不同的函数定义。类型定义够多的情况下，使用静态类型检查足矣
  }
  if (typeof arg0 === 'function') {
    res.default = arg0
  } else {
    res.required = arg0
  }
  return res
}
