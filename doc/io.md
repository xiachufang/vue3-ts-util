- [FetchQueue 自动管理loading等的请求控制容器](#fetchqueue-自动管理loading等的请求控制容器)
  - [构造参数](#构造参数)
  - [类方法/属性](#类方法属性)
  - [pushAction返回的任务实例](#pushaction返回的任务实例)
  - [例子](#例子)
    - [最小化](#最小化)
    - [排队执行，失败自动重试](#排队执行失败自动重试)
      - [更多的例子见单元测试](#更多的例子见单元测试)
  - [衍生hooks](#衍生hooks)
- [Task 轮训请求的控制](#task-轮训请求的控制)
  - [参数](#参数)
  - [返回值](#返回值)
    - [停止轮训](#停止轮训)
    - [获取轮训结果](#获取轮训结果)
    - [获取轮训参数](#获取轮训参数)
  - [一个简单的例子](#一个简单的例子)
- [makeAsyncIter 分页api的迭代管理](#makeasynciter-分页api的迭代管理)
  - [返回参数](#返回参数)
  - [一个简单的例子](#一个简单的例子-1)
  - [控制多资源，内部状态重置](#控制多资源内部状态重置)
  - [中断之前的请求](#中断之前的请求)
  - [返回类型的约束](#返回类型的约束)
  - [在vue2 options api中使用](#在vue2-options-api中使用)
  - [在小程序中使用](#在小程序中使用)
    - [最小无限滚动加载收藏的例子](#最小无限滚动加载收藏的例子)
    - [在ts/js中获取asyncIter的状态](#在tsjs中获取asynciter的状态)
    - [在wxml中获取asyncIter的状态](#在wxml中获取asynciter的状态)
      - [通过设置回调来实现状态变化时更新 setStateUpdatedCallback](#通过设置回调来实现状态变化时更新-setstateupdatedcallback)
      - [简写方式 bindPage](#简写方式-bindpage)
    - [如何知道asyncIter引发的界面修改完成时机](#如何知道asynciter引发的界面修改完成时机)
  - [常用场景的使用](#常用场景的使用)
    - [antd表格翻页](#antd表格翻页)
    - [无限滚动](#无限滚动)
- [useInfiniteScrolling 无限滚动](#useinfinitescrolling-无限滚动)
  - [探底触发](#探底触发)
  - [交叉触发模式](#交叉触发模式)
  - [hooks](#hooks)
- [useAntdListPagination / GeneralPagination  翻页管理](#useantdlistpagination--generalpagination--翻页管理)
  - [使用参考](#使用参考)

desc: 输入输出，网络请求相关的
# FetchQueue 自动管理loading等的请求控制容器
请求容器，用于控制多个请求的并发，重试，意外处理，自动控制loading，可以大量减少了`try catch finally`等代码的使用
## 构造参数
```ts
//最大并发数量， -1为不限制
maxConcurrencyCount = -1,
// 最大重试次数
maxRetryCount = 3,
// 重试间隔ms
retryInterval = 3_000,
// 错误处理方法，retry | throw
errorHandleMethod: ErrorHandleMethod = 'retry'
```
## 类方法/属性
```ts
  /**
   * 获取队列配置参数
   */
  conf: {
    maxConcurrencyCount: number;
    maxRetryCount: number;
    retryInterval: number;
    errorHandleMethod: ErrorHandleMethod;
  };
  /**
   * 等待直到当前的队列为空
   */
  waitUntilEmpty(): Promise<void>;

  /**
   * 添加队列监听器
   */
  on (name: EventName, cb: Fn) : void;

  /**
   * 是否空闲
   */
  isIdle: boolean;

  /**
   * 压入一个任务到资源获取队列，如果有提示两个任务的元和任务函数一次则这两次函数的运行会是同一个结果
   * @param meta 元标识，且将作为action函数的实参传入
   * @param action 资源获取函数
   */
  pushAction<R> (action: () => Promise<R>): ExportFetchTask<R>;
  /**
   * 添加全局监听器
   */
  static on (name: EventName, cb: (target: FetchQueue, ...args: any[]) => any) ;

```
## pushAction返回的任务实例
```ts
type ExportFetchTask<Res> = {
  // 正在运行的是哪个任务
  readonly action: () => Promise<Res>;
  // 运行结果
  readonly res: Promise<Res>;
  // 任务是否正在运行
  readonly running: boolean;
  // 取消当前任务
  readonly cancel: () => void;
}
```
## 例子
### 最小化
```ts
const queue = new FetchQueue()
const task = queue.pushAction(fetchUser)
const user = await task.res
```
### 排队执行，失败自动重试
```ts
const queue = new FetchQueue(1, -1, 0) // 不并发, 不限制重试数量，重试间隔0
queue.pushAction(action0)
queue.pushAction(action1)
queue.pushAction(action2)
queue.pushAction(action3)
await queue.waitUntilEmpty() // 将会按顺序执行所有任务，某个任务失败，会不断尝试直至完成
```
#### 更多的例子见单元测试

## 衍生hooks
在vue内的话更推荐使用包装过的几个hook，而不是裸FetchQueue。具体的文档[hooks部分](./hooks.md#usefetchqueuehelperusestrictqueueuseretryablequeue)
1. useFetchQueueHelper, 增加了更多有用的函数, 包括vue ref风格的loading。需要传入一个队列实例
2. useRetryableQueue, useFetchQueueHelper的可重试参数包装
3. useStrictQueue, useFetchQueueHelper的严格参数包装


# Task 轮训请求的控制
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
# makeAsyncIter 分页api的迭代管理
将基于游标分页的请求转成异步迭代资源，旨在提供更高程度的抽象，逻辑层只通过next()和reset()即可完成所有操作。

从jarvis的Pagination到spam的useCursorControl再到lanfan-dashboard的makeAsyncIter对于分页资源控制的探索一直有在尝试，整体是呈现一个类型推导逐渐完善，手动管理的变量逐渐变少，不再需要手动处理意外的趋势。

在makeAsyncIter这里分页资源的控制已经趋近完善，它的思想和前面两个有着较大的差别。前面两个只能说是负责帮你管理cursor，而makeAsyncIter则是让你定义资源获取的方式再暴露给你一个next()函数和一个获取到的资源的引用，让你可以通过next()的调用来进行资源的迭代

## 返回参数

```ts
interface R {
    load: Ref<boolean> // 所有资源是否已加载完成
    async next(): void // 向前迭代
    res: Ref<T> // 当前迭代到资源
    abort(): void // 中断当前请求
    loading: Ref<boolean> // 当前是否在加载中
    cursorStack: string[] // 保存使用的所有cursor
    // 重置内部状态，多资源管理时用得到,如果当前处于迭代中，直接重置会失败，考虑使用force
    reset (reFetch: boolean | { force: boolean, reFetch: boolean }): Promise<void>
    [Symbol.asyncIterator]: ES2018AsyncIter  // for await of 语法
    iter: {
      [Symbol.asyncIterator]: ES2018AsyncIter
    }
  }
```

## 一个简单的例子
```ts
const { next, res } = makeAsyncIter(cur => fetchRes(cur), resp => resp.val)
await next()
res.value // 第一页的值
await next()
res.value // 第二页的值
await next(0)
res.value // 第一页的值
```

## 控制多资源，内部状态重置
典型场景tab,keyword...改变。
例如`/recipe/search?keyword=xxxx`
在tab,keyword...变化后，需要对迭代器的内部状态进行重置，因为对应的cursor增长不一样
```ts
const keyword = ref('')
const iter = makeAsyncIter(
    cursor => axios.get('/recipe/search', { params: { cursor, keyword: keyword.value }}),
    resp => resp.recipes
)
watch([keyword], () => iter.reset(true)) // keyword改变后，重置并重新获取
```
## 中断之前的请求
典型场景例如
1. tab切换，在加载还未完成时继续切换
2. 获取远程的搜索建议，持续的输入


和上面的一样，这两种场景都是需要`reset()`，但是这个是应对请求时间较长的情况，如果你直接`reset`会引发断言错误，可以先`abort`中断掉之前的请求，或者直接`reset({ force: true })`。
但不一定需要上面那种情况，如果觉得某次迭代时间过长，也可以`abort`返回之前的状态再重新`next`。

<img width="438" alt="image" src="https://user-images.githubusercontent.com/25872019/178895676-2dc42a8d-7046-45f5-94c5-d1a83d75b7bf.png">

## 返回类型的约束
makeAsyncIter是针对基于游标分页的请求，为了要获取到cursor的信息，使用了对返回类型进行约束，必须满足以下类型，`next,next_cursor存在一个就行，prev同样`
```ts
export interface PageCursor {
  has_next: boolean
  has_prev: boolean
  next_cursor: string
  prev_cursor: string
  next: string
  prev: string
}
type Response = { cursor: PageCursor }
```
如果对应的接口不满足,可以参考下面尝试写个转换
```ts
const apiCursorNormalizer = <T extends (...args: any[]) => { cursor: customCursor }>(api: T) => {
    return (...args: Parameters<T>) => api(...args).then(resp => ({ ...resp, curosr: customCursor2PageCursor(resp.cursor) }))
}

const iter = makeAsyncIter(
    apiCursorNormalizer(fetchRecipesCustomCursor),
    resp => resp.recipes
)
```
## 在vue2 options api中使用


makeAsyncIter是使用的composition api的风格写法，只不过因为没有钩子和useXXX所以不需要强制与setup同步运行才没有以use开头，这种写法对options api不友好，不能适合直接用需要使用reactive包一层。
其他的基本一致

参考下图
1. 在js中

<img width="451" alt="image" src="https://user-images.githubusercontent.com/25872019/177975876-c1a3aaea-3b99-4ca2-a06a-f64c2c661d1f.png"></img>

2. 在模板中
<img width="337" alt="image" src="https://user-images.githubusercontent.com/25872019/177976468-0b262f3d-3f66-4afe-9796-56d4c64f8ba8.png"></img>


[源码位置](https://github.com/xiachufang/jupiter/blob/master/ganymede/src/shared/util/makeAyncIter.ts), 实现和本库的有点微小差别。

## 在小程序中使用
[源码位置](https://github.com/xiachufang/weapp/blob/master/source/lib/asyncIterator.ts)，由于小程序和vue完全不同的响应式系统，使用起来有点差别，同时也抛弃了composition api的风格写法改用了class。
### 最小无限滚动加载收藏的例子
```ts
Page({
  data: {},
  iter: new AsyncIterator(
    cursor => pagedCollectedBoards({ cursor, size: 10 }),
    resp => resp.content.cells,
    { dataUpdateStrategy: 'merge' } // 无限滚动要保留之前获取的资源所以选择merge
  ),
  onLoad () {
    this.iter.bindPage(this) // 绑定页面，为了在迭代器状态变化时通知页面
    this.iter.next() // 进行首次加载
  },
  onReachBottom () {
    this.iter.next() // 滚到底部时继续加载
  }
})
// next(), reset() , abort() 与vue3版本一致，用法参考vue3版本
```
> 模板内存在res,loading,completed3个没写明在data中的变量，在后续部分会介绍

```html
<view class="container">
  <fav-item wx:for="{{res}}" wx:key="id" cell="{{item}}"></fav-item>
  <view class="loading-bar" wx:if="{{loading}}">
    <image src="https://s.chuimg.com/upload/fe7c0b86-2e97-11e5-a56d-e0db5512b208.gif" />
  </view>
</view>
<view wx:if="{{completed}}" class="end-hint">
  -- 到底了 --
</view>
```

### 在ts/js中获取asyncIter的状态
直接通过`this.iter.state`来获取，有足够完善的类型推导
![origin_img_v2_4159e30e-6ae4-4e04-b960-75dd959be45g](https://user-images.githubusercontent.com/25872019/178453985-f36ab0b0-fea5-4a34-9a83-c393b9852124.png)

### 在wxml中获取asyncIter的状态
小程序并没有类似vue的响应式值，所有要如何去通知页面更新这块需要单独写，这边使用最简单的回调实现。
`asyncIter`内部有个值`stateUpdatedCallback`，在`asyncIter`状态变化后将会调用它。
`asyncIter`的状态包括3种，任意一个改变都会触发回调
1. loading 迭代器是否处于加载中
2. completed 迭代器是否加载完成，对应主版本中的load
3. res 迭代后获取到资源

#### 通过设置回调来实现状态变化时更新 setStateUpdatedCallback
```ts
this.iter.setStateUpdatedCallback(() => {
  this.setData(this.iter.state) // 将会把loading，completed，res隐式的更新到this.data上。即使你没在page.data里面写
}) // 在模板中 {{res}} {{completed}} 使用
// 不嫌麻烦也可以
this.iter.setStateUpdatedCallback(() => {
  const { res, laoding, completed } = this.iter.state
  this.setData({ list: res, pending: loading, hasMore: !completed }) // list, pending,hasMore为data中写明
})  // 在模板中 {{list}} {{hasMore}} 使用
```
#### 简写方式 bindPage
是`setStateUpdatedCallback`的进一步简化，需要注意的是`setStateUpdatedCallback`和`bingPage`同时只生效一个
```ts
this.iter.bindPage(this) // 在模板中 {{res}} {{completed}} 使用
this.iter.bindPage(this, 'recommend') // 在模板中 {{recommend.res}} {{recommend.completed}} 使用
```
然后无论是使用`setStateUpdatedCallback`还是`bingPage`，在脚本文件中我都不推荐使用`this.data.res`取获取状态，而是应该`this.iter.state.res`。
### 如何知道asyncIter引发的界面修改完成时机
在vue3,vue2中我们直接
```ts
await iter.next()
await nextTick()
// 现在就已经界面更新完成
```
而在小程序中不是nextTick可以通过setData的回调来实现，因此可以这样
```ts
 this.iter.setStateUpdatedCallback(() => {
      this.setData(this.iter.state, () => {
        // do something
      })
})
```

## 常用场景的使用
直接使用的makeAsyncIter的场景并不多，makeAsyncIter是对分页资源的一种可迭代的抽象。
日常中更多的是使用针对不同场景使用不同的适配，makeAsyncIter与这些的关系有点类似zrender和echarts
### antd表格翻页
参考[useAntdListPagination](#useAntdListPagination)
### 无限滚动
参考[useInfiniteScrolling](#useInfiniteScrolling)
# useInfiniteScrolling 无限滚动
useInfiniteScrolling是针对无限滚动做的一个适配，包含了两种触发模式，探底触发和交叉触发。
## 探底触发
探底触发适用于整个页面向下滚动，页面滚动到底部达到一定阈值是进行资源迭代，场景例如厨房装备页的滚动到底部加载。
```ts
const { loading, res, observe, reset } = useInfiniteScrolling(
  cursor => getPagedRecipe({ cursor }),
  resp => resp.recipes, { type: 'reach-bottom', threshold: 300 } // threshold 触发阈值，可空默认500
)
```
```html
<ul>
  <li v-for="item in res ?? []" :key="recipe.id">{{item.data}}</li>
</ul>
```
## 交叉触发模式
交叉触发适用于只是页面中的一部分进行滚动，当监听目标dom与根dom交叉时进行资源迭代，我们的后台项目大多用的这种，例如lanfan-dashboard的菜谱搜索组件和定制餐单的历史列表页。
```ts
const root = ref<HtmlDivElement>()
const { loading, res, observe, reset } = useInfiniteScrolling(
  cursor => getPagedRecipe({ cursor }),
  resp => resp.recipes, { type: 'intersection', root } // root可空，默认使用文档视口
)
```
```html
<div ref="root">
  <ul>
    <li v-for="item in res ?? []" :key="recipe.id">{{item.data}}</li>
  </ul>
  <div :ref="observe"></div>
</div>
```
##
![无限加载](https://user-images.githubusercontent.com/25872019/129327249-8545ba7a-0bc5-491d-8001-b20226933c7c.gif)
## hooks

如果说需要在获取到的前后做一些事情，可以实现通过传一个hooks的对象
```ts
interface InfiniteScrollingHooks {
    iterationPre?: () => Promise<void>
    iterationPost?: () => Promise<void>
}

// 再
await hooks.iterationPre?.()
await iter.next()
await hooks.iterationPost?.()
```


# useAntdListPagination / GeneralPagination  翻页管理
useAntdListPagination是makeAsyncIter针对翻页做的一个适配，与GeneralPagation组件搭配使用，可以很容易写的出来一个翻页的组件
## 使用参考
```ts
const { loading, pagination, res, reset } = useAntdListPagination(
    cursor => PlatformProjectClient.paged({ cursor, keyword: keyword.value }),
    resp => resp.projects
)
```
```html
<a-table :data-source="res ?? []" row-key="id" :pagination="false"  />
<general-pagination :option="pagination" />
```
