/* eslint-disable no-plusplus */
import { Task, TaskParams, delay } from '../src'
import { ExpectError } from './expectError'



describe('Task 轮询请求辅助类', () => {
  jest.setTimeout(10 * 1000)
  Task.silent = true // 不需要错误报告
  const shareOption = (): TaskParams<number> => {
    let i = 0
    return {
      action () {
        i += 1
        return i
      },
      validator: r => r === 5,
      pollInterval: 100
    }
  }

  it('轮询结束后reslove promsie', () => {
    const { completedTask } = Task.run(shareOption())
    return completedTask // 返回一个promsie,如果在超时内没fulfilled，会报错
  })

  it('action,验证器运行正常', async () => {
    const { completedTask, task } = Task.run(shareOption())
    const res = await completedTask
    expect(res).toBe(5)
    expect(res).toBe(task.res)
  })

  it('立即运行action马上完成后没再运行', async () => {
    // 立即运行的第一个比较特殊，可以看代码
    const { completedTask, task } = Task.run({ ...shareOption(), validator: () => true })
    await completedTask
    await delay(1000)
    expect(task.res).toBe(1)
  })

  it('验证器验证action返回的结果可用后不再运行', async () => {
    const { completedTask, task } = Task.run(shareOption())
    await completedTask
    await delay(1000)
    expect(task.res).toBe(5) // 3秒内action没再运行过，结果还是5
  })

  it('action运行时发生异常默认直接忽略重试', async () => {
    const so = shareOption()
    const { completedTask, task } = Task.run({
      ...so,
      action () {
        if (Math.random() < 0.3) {
          throw new Error()
        } else {
          return so.action()
        }
      }
    })
    await completedTask
    expect(task.res).toBe(5)
  })

  it('errorHandleMethod:"stop" 定义action运行时发生异常直接停止并抛异常', async () => {
    const so = shareOption()
    /** 发生首个错误时的res */
    let resWhenFirstError: number|undefined
    const env = ExpectError.makeRandomErrorEnv()
    const { completedTask, task } = Task.run({
      ...so,
      errorHandleMethod: 'stop',
      action () {
        env.try() // 有一定几率触发异常
        return so.action()
      }
    })
    env.eventEmiter.on('error', () => {
      if (env.errorCount === 1) { // 记录首次触发时的结果
        resWhenFirstError = task.res
      }
    })
    try {
      await completedTask
    } catch (error: unknown) {
      ExpectError.printIfNotExpect(error)
    }
    expect(env.errorCount).toBe(1) // 预期有且仅有一次
    expect(task.isFinished).toBeTruthy()
    expect(task.res).toBe(resWhenFirstError)
  })

  it('手动清理后不再运行', async () => {
    const { clearTask, task } = Task.run({ ...shareOption(), validator: void 0 })
    await delay(1000)
    const res1 = task.res // 记录2秒的结果
    clearTask() // 停止任务运行，预期结果不变
    await delay(1000)
    expect(res1).toBe(task.res)
  })
})
