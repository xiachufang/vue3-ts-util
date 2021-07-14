/**
 * 生成一个会返回mutation函数的函数
 */
export const mutation = <S> () => {
  return <K extends keyof S> (key: K) => {
    return (s: S, arg: S[K]) => {
      s[key] = arg
    }
  }
}
