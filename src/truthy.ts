import { ok } from '.'

/**
 * 确保一个值为真值, 若不符合则断言失败
 * 相较于使用非空断言!，可以更早的断言失败
 */
export const truthy = <T>(v: T | null | undefined | false): T => {
  ok(v)
  return v
}
