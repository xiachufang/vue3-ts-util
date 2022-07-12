# useDomRect
用于获取dom的rect
```ts
const contentDom = ref<HTMLDivElement>()
const { rect } = useDomRect(contentDom) // rect即为contentDom的rect,尺寸发生改变时他也会改
```
# useEmit
用于在hook内emit，避免多传一个ctx
```ts
const { emit, emitValue, emitModal } = useEmit()
const onClick = () => {
  emit('change', e) // 和ctx.emit 一致
  emitValue('hello') // 事件update:value的简写
  emitModal('world') // 事件update:modelValue的简写
}
```
# useFetchQueueHelper/useStrictQueue/useRetryableQueue
fetchqueue的hook wrapper
1. useFetchQueueHelper, 增加了更多有用的函数, 包括vue ref风格的loading。需要传入一个队列实例
2. useRetryableQueue, useFetchQueueHelper的可重试参数包装
3. useStrictQueue, useFetchQueueHelper的严格参数包装
```ts
const { loading, run, fetchQueue } = useStrictQueue()
loading.value // 队列是否在跑任务
const res = await run(fetcRes) // pushAction的简写，更简短的方式
const res = await fetchQueue.pushAction(fetchRes).res // 和上面那个一致
```
# useInfiniteScrolling
见[doc/io.md#useinfinitescrolling](/doc/io.md#useinfinitescrolling)
# useResizeable
用于鼠标拖拽调整调整某个元素的大小位置,demo状态写了一半发现用不上，但是现有的实现都能用
```ts
const ele = ref<HTMLDivElement>()
const { style } = useResizable(ele, { width: 100, height: 100, x: 100, y: 100 })
```
```html
<div :style="`position:fixed;${style}`" ref="ele">
</div>
```
# useStackAlloc
给上传的文件视频图片等blob分配一个url,并且组件卸载后释放这个资源，不用手动释放担心内存泄露RAII
```ts
const { alloc } = useStackAlloc()
const ptr = alloc(blob) // 现在可以将ptr作为url，提供video/image查看
```
# useWatchDocument
`document.addEventListener`的hook wrapper。在组件卸载前删除监听器
```ts
useWatchDocument('scroll', throttle((e) => {
  console.log(e)
}, 200))
```
