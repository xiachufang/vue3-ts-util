- [useDomRect hook风格获取dom的rect](#usedomrect-hook风格获取dom的rect)
- [useEmit 用于在hook内emit](#useemit-用于在hook内emit)
- [useFetchQueueHelper/useStrictQueue/useRetryableQueue fetchqueue的hook wrapper](#usefetchqueuehelperusestrictqueueuseretryablequeue-fetchqueue的hook-wrapper)
- [useInfiniteScrolling 无限滚动](#useinfinitescrolling-无限滚动)
- [useResizeable 用于鼠标拖拽调整调整某个元素的大小位置](#useresizeable-用于鼠标拖拽调整调整某个元素的大小位置)
- [useStackAlloc hook风格管理object url分配](#usestackalloc-hook风格管理object-url分配)
- [useWatchDocument `document.addEventListener`的hook wrapper](#usewatchdocument-documentaddeventlistener的hook-wrapper)
- [createTypedShareStateHook/useHookShareState 生成一个实例内进行状态共享的hook](#createtypedsharestatehookusehooksharestate-生成一个实例内进行状态共享的hook)
- [useRouteId 路由参数id获取，合法判断](#userouteid-路由参数id获取合法判断)
desc: vue3 composition api的hook
# useDomRect hook风格获取dom的rect
```ts
const contentDom = ref<HTMLDivElement>()
const { rect } = useDomRect(contentDom) // rect即为contentDom的rect,尺寸发生改变时他也会改
```
# useEmit 用于在hook内emit
避免多传一个ctx
```ts
const { emit, emitValue, emitModal } = useEmit()
const onClick = () => {
  emit('change', e) // 和ctx.emit 一致
  emitValue('hello') // 事件update:value的简写
  emitModal('world') // 事件update:modelValue的简写
}
```
# useFetchQueueHelper/useStrictQueue/useRetryableQueue fetchqueue的hook wrapper
1. useFetchQueueHelper, 增加了更多有用的函数, 包括vue ref风格的loading。需要传入一个队列实例
2. useRetryableQueue, useFetchQueueHelper的可重试参数包装
3. useStrictQueue, useFetchQueueHelper的严格参数包装
```ts
const { loading, run, fetchQueue } = useStrictQueue()
loading.value // 队列是否在跑任务
const res = await run(fetcRes) // pushAction的简写，更简短的方式
const res = await fetchQueue.pushAction(fetchRes).res // 和上面那个一致
```
# useInfiniteScrolling 无限滚动
见[doc/io.md#useinfinitescrolling](/doc/io.md#useinfinitescrolling)
# useResizeable 用于鼠标拖拽调整调整某个元素的大小位置
demo状态写了一半发现用不上，但是现有的实现都能用
```ts
const ele = ref<HTMLDivElement>()
const { style } = useResizable(ele, { width: 100, height: 100, x: 100, y: 100 })
```
```html
<div :style="`position:fixed;${style}`" ref="ele">
</div>
```
# useStackAlloc hook风格管理object url分配
给上传的文件视频图片等blob分配一个url,并且组件卸载后释放这个资源，不用手动释放担心内存泄露RAII
```ts
const { alloc } = useStackAlloc()
const ptr = alloc(blob) // 现在可以将ptr作为url，提供video/image查看
```
# useWatchDocument `document.addEventListener`的hook wrapper
在组件卸载前会删除监听器
```ts
useWatchDocument('scroll', throttle((e) => {
  console.log(e)
}, 200))
```

# createTypedShareStateHook/useHookShareState 生成一个实例内进行状态共享的hook
```ts
const { useHookShareState } = createTypedShareStateHook(() => ({ count: 0 }))
const useA = () => {
  const { state } = useHookShareState()
  state.count++
}
const useB = () => {
  const { count } = useHookShareState().toRefs() // 使用torefs展开
  count.value++ // 若useA与useB在同一实例内，则这两个为同一个数
}
```
更多细节可以看相关单元测试


# useRouteId 路由参数id获取，合法判断
```ts
const id = useRouteId()
id.src // id的源，转成数字
id.srcStr // 同上，但是不转成数字
id.isVaild // 是否合法，条件转成数字后不是nan且不为0,一般我们是把id为0当成创建的页面
```
