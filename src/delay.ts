
/**
 * 返回一个在预定时间后resolve的promise
 */
export const delay = (timeout = 0) => new Promise<void>(resolve => setTimeout(resolve, timeout))

/**
  * 返回一个在预定时间后resolve的函数
  */
export const delayFn = (time = 0) => () => delay(time)
