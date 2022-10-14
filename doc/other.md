- [deepComputed](#deepcomputed)
  - [主要的使用场景](#主要的使用场景)
  - [性能相关](#性能相关)
  - [需要注意的问题](#需要注意的问题)
    - [如果发现修改了值但setter没被调用](#如果发现修改了值但setter没被调用)
    - [调用了一次值的函数(例如Array::splice)，但是setter被多次调用？](#调用了一次值的函数例如arraysplice但是setter被多次调用)
    - [原因](#原因)
    - [解决方法](#解决方法)
- [deepComputedEffect 更好的deepComputed](#deepcomputedeffect-更好的deepcomputed)
- [deepComputedPick 执行后二值之间仍然会双向同步的pick](#deepcomputedpick-执行后二值之间仍然会双向同步的pick)
- [events/typedEventEmitter 类型安全的EventEmitter](#eventstypedeventemitter-类型安全的eventemitter)
- [image/getImageUrl 从下厨房用的图像结构构造url](#imagegetimageurl-从下厨房用的图像结构构造url)
- [assigIncrId 生成一个全局自增id](#assigincrid-生成一个全局自增id)
- [unid/typedID/ID 使用symbol实现的ID生成器](#unidtypedidid-使用symbol实现的id生成器)
- [delay,delayFn 延时，推迟控制流执行](#delaydelayfn-延时推迟控制流执行)
- [promise2ref promise转成ref](#promise2ref-promise转成ref)
- [promiseSetRef 在promise完成时设置某个ref](#promisesetref-在promise完成时设置某个ref)
- [momentConvert 一个函数实现下厨房常用的多种时间转换](#momentconvert-一个函数实现下厨房常用的多种时间转换)

desc: 其余不好分类的函数
# deepComputed
**已废弃改用deepComputedEffect， deepComputed已经上线了一年多，比较稳定暂时不删除**
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

## 需要注意的问题
### 如果发现修改了值但setter没被调用
请首先考虑是不是监听深度不够的问题，具体限制见上面。
### 调用了一次值的函数(例如Array::splice)，但是setter被多次调用？
### 原因
deepComputed是监听值的属性，调用值的成员函数可能会造成属性的多次变更。
例如Array::splice
```ts
const arr = ['world']
arr.splice(0,0,'hello')
 // 他会分成三步执行
 // 第一步，将2的位置设置成'world',变成
['world', 'world']
 // 第二步，将1的位置设置成'hello',变成
['hello', 'world']
 // 第三步设置长度到2
 arr.length = 2
 // 这个过程将会调用3次setter
```
### 解决方法
1. 直接忽略，相信大部分的场景都不需要考虑性能
2. 使用debounce，直接在第二个参数里加`{ debounceSet: 10 }`就可以将大部分的密集的修改合并到一次，具体设置的数字看场景而定
3. deepComputedEffect支持直接对.value设置值，

# deepComputedEffect 更好的deepComputed
使用实现vue 原生effect api实现的deepComputed，语法概念基本相同，性能更好，去掉了诸多限制。
相较于deepComputed
1. deepComputedEffect是对整个树进行的监控，不用考虑深度问题
2. deepComputedEffect支持.value = newVal, 对根部设置值，且不再强制要求是object
3. 对deepComputedEffect返回值的修改触发的set回调，将不再是同步的，而是会在当前tick结束后触发（不会再出现调用了一次值的函数(例如Array::splice)，但是setter被多次调用？这种问题）
4. 移除了proxy因为set回调的触发是异步的，因为是多个合并的无法明确追踪路径，需要自己比较

```ts
const { emitValue } = useEmit()
const model = deepComputedEffect({
  get: () => props.value,
  set: emitValue
})
model.value = {  } // model.value将会被同步修改，和computed不同，这点看起来不是那么纯粹，但这是出于性能考虑
await nextTick()
// 触发emitValue
model.value.text = 'hello world'
await nextTick()
// 触发emitValue
```
# deepComputedPick 执行后二值之间仍然会双向同步的pick
用法类似lodash的pick，区别是当你修改了model后在下个tick picked也会更新，反过来也一样，主要用于拆分大的model，具体可以参考对应测试
```ts
const model = ref({ a: 1, b: 2, c: 3 })
const picked = deepComputedPick(model, ['a', 'b'])
```

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
# assigIncrId 生成一个全局自增id
# unid/typedID/ID 使用symbol实现的ID生成器
使用symbol实现，相较于直接添加数字或者是字符串id，最大的好处是不会污染数据本身,id不会被序列化，key也是迭代不出来。
适用于需要比较场合，例如v-for的key，如果是回进行数组内部的删除或者是调整顺序那么就不能使用index作为key，这时候就需要ID生成器。当然如果后端有返回id，那直接使用返回的。

例如以下的情况，同时编辑多种用料，用料位置可拖拽调整，可新增删除
```ts
import { ID, unid, UniqueId, typedID, idKey } from 'vue3-ts-util'
interface Ing extends UniqueId {
  name: string
  amount: numebr
}
const ings: Ing[] = []
// 正常情况下就这样,可以获取足够完善的类型提示
const newIng = ID<Ing>({ name: '胡萝卜', amount: 1 })
// 但是如果你这样
const newIng: Ing = ID({ name: '胡萝卜', amount: 1 })
// 或者这样时，虽然也有类型检测，输入name时也能提示，但是相对于第一种不够好,因为比较的是id的返回值和push函数
ing.push(ID({ name: '胡萝卜', amount: 1 }))


// 那么可以这样，就可以获得足够完善的类型提示
const ingId = typedID<Ing>()
const newIng = ingId({ name: '胡萝卜', amount: 1 })
ing.push(ingId({ name: '胡萝卜', amount: 1 }))

if (newIng[idKey] !== oldIng[idKey]) {
  // 比较可以这样
}
```
当然如果对这种方法觉得麻烦直接`obj._id = uniqueId()`
# delay,delayFn 延时，推迟控制流执行
```ts
await delay(300)
doSomething() // 延迟300ms执行
```

# promise2ref promise转成ref
# promiseSetRef 在promise完成时设置某个ref
# momentConvert 一个函数实现下厨房常用的多种时间转换
使用方法见单元测试momentConvert部分
