/* eslint-disable @typescript-eslint/no-parameter-properties */
import { EventEmitter } from 'eventemitter3'
import type { Fn } from 'vuex-dispatch-infer'
import { deepReadonly, delay, typedEventEmitter, TypedEventEmitter } from '.'
type EventName = 'RETRIES_EXHAUESTED' | 'FETCH_QUEUE_CHANGE' | 'FETCH_QUEUE_IDLE_STATE_CHANGE'
export class FetchTaskCancel extends Error {
  constructor(msg?: string) {
    super(msg)
    this.name = 'FetchTaskCancel'
  }
}
type ActionEventEmitter = TypedEventEmitter<{ cancel: undefined }>
export type ActionArg = { events: ActionEventEmitter }
export interface FetchTask<Res, Extra> {
  /**
   * 任务运行函数
   * 会传入当前实例,支持在action设置被cancel时的行为
   */
  action: (inst: ActionArg) => Promise<Res>
  /**
   * 任务结果，异步
   */
  res: Promise<Res>
  /**
   * 任务是否正在运行，因为有最大并发数量的限制，可能不会马上分到时间
   */
  running: boolean

  /**
   * 取消当前任务
   */
  cancel (): void

  /**
   * 携带的额外信息你可以使用他标识一个任务
   */
  extra: Extra

  /**
   * 运行该任务，私有
   */
  run: () => void

  events: ActionEventEmitter
}
/**
 * 对外暴露的任务压入到队列的运行标识
 */
type ExportFetchTask<Res, Extra> = Readonly<Omit<FetchTask<Res, Extra>, 'run'>>
/**
 * 内部队列实现
 */
type FetchQueueInternal<Extra> = FetchTask<any, Extra>[]
/**
 * 错误处理方法
 */
type ErrorHandleMethod = 'retry' | 'throw' // 重试或者直接抛异常
export class FetchQueue<Extra = undefined> {
  // eslint-disable-next-line no-useless-constructor
  constructor(
    /**
     * 最大并发数量
     */
    private readonly maxConcurrencyCount = -1,

    /**
     * 最大重试次数
     */
    private readonly maxRetryCount = 3,

    /**
     * 重试间隔ms
     */
    private readonly retryInterval = 3_000,

    /**
     * 错误处理方法
     */
    // eslint-disable-next-line no-empty-function
    private readonly errorHandleMethod: ErrorHandleMethod = 'retry') {

  }

  private static eventEmitter = new EventEmitter()

  private eventEmitter = new EventEmitter()

  private queue: FetchQueueInternal<Extra> = []

  private get currConcurrencyCount () {
    return this.queue.filter(item => item.running).length
  }

  get tasks () {
    return deepReadonly([...this.queue])
  }

  get conf () {
    const { maxConcurrencyCount, maxRetryCount, retryInterval, errorHandleMethod } = this
    return deepReadonly({ maxConcurrencyCount, maxRetryCount, retryInterval, errorHandleMethod })
  }

  /**
   * 提醒队列发生变化
   */
  private noticeChange () {
    this.eventEmitter.emit('FETCH_QUEUE_CHANGE', this.queue)
  }

  private lastIdleState = true

  /**
   * 提醒队列空闲情况发生变化
   */
  private noticeIdleChange () {
    if (this.isIdle === this.lastIdleState) { // 状态没变化不需要通知
      return
    }
    this.lastIdleState = this.isIdle
    this.eventEmitter.emit('FETCH_QUEUE_IDLE_STATE_CHANGE', this.isIdle)
  }

  /**
   * 尝试运行首个空闲任务
   */
  private tryRunNext () {
    // 如果当前并发数量小于最大并发数量或者不限制并发数量
    if (this.currConcurrencyCount < this.maxConcurrencyCount || this.maxConcurrencyCount === -1) {
      const front = this.queue.filter(item => !item.running).shift() // 获取空闲队列的首个
      if (front) {
        front.run()
      }
    }
  }

  /**
   * 运行任务
   */
  private runAction<R> (task: FetchTask<R, Extra>, onResolve: (arg: R) => void, onReject: (e: Error) => void) {
    const { action } = task
    task.running = true
    this.noticeIdleChange()
    // 增加一个action的wrap便于递归
    const actionRetryWrap = async (availableRetryCount = this.maxRetryCount): Promise<void> => {
      try {
        const res = await action(task as any)
        onResolve(res)
      } catch (error: any) {
        switch (this.errorHandleMethod) {
          case 'retry':
            if (availableRetryCount === 0) { // 不允许再重试
              this.emit('RETRIES_EXHAUESTED', task)
              return onReject(error)
            }
            await delay(this.retryInterval) // 等待一定间隔后再次重试
            return actionRetryWrap(availableRetryCount - 1) // 递归尝试
          case 'throw':
            return onReject(error) // 直接拒绝
        }
      }
    }
    actionRetryWrap()

  }

  /**
   * 等待直到当前的队列为空
   */
  waitUntilEmpty () {
    return Promise.all(this.queue.map(v => v.res))
  }

  /**
   * 添加队监听器
   */
  on (name: EventName, cb: Fn) {
    this.eventEmitter.on(name, cb)
  }

  /**
   * 添加全局监听器
   */
  static on (name: EventName, cb: (target: FetchQueue, ...args: any[]) => any) {
    FetchQueue.eventEmitter.on(name, cb)
  }

  /**
   * 添加队监听器
   */
  private emit (name: EventName, ...args: any[]) {
    this.eventEmitter.emit(name, ...args)
    FetchQueue.eventEmitter.emit(name, this, ...args)
  }

  /**
   * 是否空闲
   */
  get isIdle () {
    return this.queue.length === 0
  }

  /**
   * 压入一个任务到资源获取队列
   * @param action 资源获取函数
   * @param extra 额外信息，常用于标识
   */
  pushAction<R> (action: (inst: ActionArg) => Promise<R>, ...args: Extra extends undefined ? [] : [extra: Extra]): ExportFetchTask<R, Extra> {
    let onResolve: (arg: R) => void
    let onReject: (error: Error) => void
    const res = new Promise<R>((resolve, reject) => {
      onResolve = resolve
      onReject = reject
    })
    const events = typedEventEmitter().eventEmitter as ActionEventEmitter
    const task: FetchTask<R, Extra> = {
      running: false,
      action,
      res,
      extra: args[0]!,
      cancel: () => {
        events.emit('cancel')
        onReject(new FetchTaskCancel())
      },
      run: () => this.runAction(task, onResolve, onReject),
      events
    }
    res.finally(() => {
      // 当前任务完成或者出现异常但是处理完了后，从队列中移除，并通知队列，队列空闲状态变化，并尝试运行下一个
      this.queue.splice(this.queue.indexOf(task), 1)
      task.running = false
      this.noticeChange()
      this.noticeIdleChange()
      this.tryRunNext() // 当前任务完成运行队列的下一个任务
    })
    this.queue.push(task)
    this.noticeChange()
    this.tryRunNext() // 尝试运行刚才压入的任务
    return task
  }

}
