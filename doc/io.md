# FetchQueue
请求容器，用于控制多个请求的并发，重试，意外处理，自动控制loading，可以大量减少了`try catch finally`等代码的使用


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
将基于游标分页的请求转成异步迭代资源

从jarvis的Pagination到spam的useCursorControl再到lanfan-dashboard的makeAsyncIter对于分页资源控制的探索一直有在尝试，整体是呈现一个类型推导逐渐完善，手动管理的变量逐渐变少，不再需要手动处理意外的趋势。

在makeAsyncIter这里分页资源的控制已经趋近完善，它的思想和前面两个有着较大的差别。前面两个只能说是负责帮你管理cursor，而makeAsyncIter则是让你定义资源获取的方式再暴露给你一个next()函数和一个获取到的资源的引用，让你可以通过next()的调用来进行资源的迭代

## 返回参数

```ts
interface R {
    load: Ref<boolean>, // 所有资源是否已加载完成
    async next(): void, // 向前迭代
    res: Ref<T>, // 当前迭代到资源
    loading: Ref<boolean>, // 当前是否在加载中
    cursorStack: string[], // 保存使用的所有cursor
    reset (reFetch: bool): void, // 重置内部状态，多资源管理时用得到
    [Symbol.asyncIterator]: ES2018AsyncIter,  // for await of 语法
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

## 返回类型的约束
makeAsyncIter是针对基于游标分页的请求，为了要获取到cursor的信息，使用了对返回类型进行约束的并发，必须满足以下类型，`next,next_cursor存在一个就行，prev同样`
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
    return (...args: Parameters<T>) => api(...args).then(resp => customCursor2PageCursor(resp.cursor))
}

const iter = makeAsyncIter(
    compose(apiCursorNormalizer, fetchRecipesCustomCursor),
    resp => resp.recipes
)
```
## 常用场景的使用
直接使用的makeAsyncIter的场景并不多，makeAsyncIter是对分页资源的一种可迭代的抽象。
日常中更多的是使用针对不同场景使用不同的适配，makeAsyncIter与这些的关系有点类似zrender和echarts
### antd表格翻页
参考[useAntdListPagination](#useAntdListPagination)
### 无限滚动
参考[useInfiniteScrolling](#useInfiniteScrolling)

# useInfiniteScrolling
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


# useAntdListPagination
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
