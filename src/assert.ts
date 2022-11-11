class AssertError extends Error { }
export function assert (value: unknown, msg?: string): asserts value {
  if (!value) {
    throw new AssertError(msg ?? '断言失败')
  }
}
export function ok (value: unknown, msg?: string): asserts value {
  if (!value) {
    throw new AssertError(msg ?? '断言失败')
  }
}
