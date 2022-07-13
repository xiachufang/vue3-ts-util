- [deepComputed](#deepcomputed)
  - [主要的使用场景](#主要的使用场景)
  - [性能相关](#性能相关)
- [events/typedEventEmitter 类型安全的EventEmitter](#eventstypedeventemitter-类型安全的eventemitter)
- [image/getImageUrl 从下厨房用的图像结构构造url](#imagegetimageurl-从下厨房用的图像结构构造url)
# deepComputed
其概念类似computed函数，使用get获取初始化值，在调用get时收集外部依赖，在外部依赖变化时重新生成自己。.value = xxx时调用set函数。不过computed仅支持最外层的变化，而deepComputed则是支持更深层次的变化。
改用deepComputed最明显的几个好处则是不需要手动外部数据的变化，不需要在数据修改后各种烦人的dispatch('xxxx'，xxx.value)或者ctx.emit('update:xxx'，xxx.value)`,在数据变化后自动帮你提交。
## 主要的使用场景
例如一个超大型的表单拆分成数个小组件，每个小组件都通过v-model&ctx.emit与父组件通信.
```ts
    // 例如是控制表单日期的部分
    const date = deepComputed({
      get: () => props.date,
      set: v => ctx.emit('update:date', v)
    })
```
或者是需要读写vuex表单，官方推荐则是对表单的所有字段写个action commit，而使用deepComputed则不需要这么麻烦，像正常的computed那样就行，并且可以严格保证flux的架构
```ts
const recipe = deepComputed({
    get: () => {
      const { createRecipe } = store.state
      return createRecipe.recipe
    },
    set: v => dispatch('createRecipe/setRecipe', v)
  })
```
这两种deepComputed都能保证两处的值在操作后是一致的，因此我感觉可以理解为deepComputed结果的值是对另外一个值部分引用的持有
## 性能相关
在性能方面deepComputed，支持set和get时的双向防抖，默认关闭。以及set, get时的clone，默认启用。
该函数不是简单的watch({deep:true})实现，那样会导致watch和set相互调用栈溢出，而是使用proxy实现，默认监控浅层的object以及持续的array，在vue2中不可用，与vue2的响应式实现冲突。
![image](https://user-images.githubusercontent.com/25872019/178645084-055e3e18-8514-4df0-b0ef-8aca3015c5f7.png)
<div style="text-align:center">图 替换为deepComputed前后的两种写法，二者等价</div>


# events/typedEventEmitter 类型安全的EventEmitter
用法和node 的EventEmitter一样，不过新增了类型检查和hook风格管理的监听 useEventListen
```ts
const { eventEmitter, useEventListen } = typedEventEmitter<{ userInfoLoaded: undefined, cancelTask: number }>()
eventEmitter.emit('userInfoLoaded') // ok
eventEmitter.emit('userInfo') // 类型错误
eventEmitter.emit('cancelTask') // 类型错误
eventEmitter.emit('cancelTask', 1) // ok
eventEmitter.on('cancelTask', (v: string) => { // 类型错误
  ///
})
eventEmitter.on('cancelTask', (v) => { // ok
  v // 这是一个数字
})
useEventListen('userInfoLoaded', () => console.log('userInfoLoaded')) // 和其他hook一样，组件卸载前会清理掉，不用手动删除
```
<img width="938" alt="image" src="https://user-images.githubusercontent.com/25872019/178647509-27459f7a-0e53-4779-8461-887205d12bc5.png">

# image/getImageUrl 从下厨房用的图像结构构造url
```ts
const url = getImageUrl(image)
```
