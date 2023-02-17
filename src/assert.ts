class AssertError extends Error {
  constructor(msg = 'Oops! 出了点问题。请检查您的代码。') {
    super(msg)
    this.name = AssertError.name
  }
}

export function assert (value: unknown, msg?: string): asserts value {
  if (!value) {
    throw new AssertError(msg)
  }
}
export function ok (value: unknown, msg?: string): asserts value {
  if (!value) {
    throw new AssertError(msg)
  }
}
