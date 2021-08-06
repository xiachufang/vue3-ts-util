# FetchQueue
# Task
Task是针对轮训请求的一个封装，主要还是用于各类分析结果的轮训获取。在之前是Task还支持定时在某个时刻去执行action，后来用不到就删除了。

## 参数
```ts

  /**
   * 任务函数，支持异步
   */
  action: () => T | Promise<T>;
  /**
   * 立即执行还是等下次轮训间隔后再再执行
   */
  immediately?: boolean;
  
  /**
   * 验证器，action结束后调用，为true时结束当前任务
   */
  validator?: (r: T) => boolean;

  /**
   * 发生错误的错误方法，忽略还是立即停止 
   */
  errorHandleMethod? : 'stop'|'ignore'
  /**
   * 轮询间隔，ms
   */
  pollInterval: number
```
## 返回值
返回一个对象，可以通过解构获取以下
### 停止轮训
```ts
clearTask: () => void
```
### 获取轮训结果
```ts
completedTask: Promise<T>
```
### 获取轮训参数
```ts
task: TaskInst<T>
```
## 一个简单的例子
```ts
const { completedTask } = Task.run({
    pollInterval: 5_000, // 轮训间隔5000ms
    action: getFunnelRes, // 获取漏斗分析结果
    validator: v => v.status === 'completed' // 判断是否可以结束轮训,v是action执行完的返回值
})
completedTask.then(res => {
    console.log(res) // 这是可用的数据
})
```
# makeAsyncIter
