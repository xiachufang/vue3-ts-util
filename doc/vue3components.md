- [GeneralPagination 翻页器和相关hook](#generalpagination-翻页器和相关hook)
- [SplitView 支持鼠标拖拽调整的视图分割](#splitview-支持鼠标拖拽调整的视图分割)
  - [props](#props)
  - [例子](#例子)
- [SearchSelect 支持搜索的选择，追求尽可能少的代码来描述](#searchselect-支持搜索的选择追求尽可能少的代码来描述)
  - [props](#props-1)
  - [例子](#例子-1)
desc: 本库的vue3组件

记得先全局导入，或者单独导入
```ts
import { SearchSelect, SplitView, GeneralPagination } from 'vue3-ts-util'

const app = createApp(App)
Object.entries({
  SplitView,
  GeneralPagination,
  SpinSection
}).forEach(args => app.component(...args))
```
# GeneralPagination 翻页器和相关hook
具体见[io的相关部分](./io.md#useantdlistpagination--generalpagination-翻页管理)
# SplitView 支持鼠标拖拽调整的视图分割
本库只实现了左右分割，需要上下分割，我在这里实现了[vue-ts-util-lite](https://github.com/zanllp/vue3-ts-util-lite/blob/main/src/SplitView/index.vue)
## props
percent: 左边的视图的占比,number，默认50
border: bool 一个浅灰色的框用来区分视图，默认关闭
## 例子
```html
<split-view v-model:percent="splitPercent">
  <template #left>
    <div class="content-left"/>
  </template>
  <template #right>
    <div class="content-right"/>
  </template>
</split-view>
```

# SearchSelect 支持搜索的选择，追求尽可能少的代码来描述
1. 支持按照输入来搜索，关键字将会使用红色表明并按照出现顺序排序
2. 支持虚拟列表
3. 支持多选
4. 把转换移到了ts，尽可能减少繁琐的模板，增加类型推导，还可以直接闭包

![iShot2022-07-14 17 32 11](https://user-images.githubusercontent.com/25872019/178951654-a1258dac-3084-43bd-bed7-c093c6749935.gif)
## props
options 选项数组
conv 定义如何从选项数组转换到值以及选项的文本，key回填时显示的文本,具体见SearchSelectConv
value v-model的值，如果为多选类型则为array，否则是conv.value的返回类型
mode 模式 多选的话multipie，单选不需要写
asNullValues 可以看做是空值的列表, 默认0和空字符串，即传入0和空字符串时会把他当成是null来对待，而显示placeholder
## 例子
```ts
const options = '黄瓜，土豆，胡萝卜，西红柿，茄子'.split('，').map((name,idx) => ({ id: idx + 1, name }))
const conv: SearchSelectConv<{ id: number; name: string }> = {
  text: v => v.name,
  value: v => v.id
  // 还有optionText, key 可空
}
const selectedID = ref<number>()
```
```html
<search-select :options="options" v-model:value="selectedID" :conv="conv"/>
```
如果你传入的选项中存为值为0，''的值时，你需要这样添加`:as-null-values="[]"`，不然在选中0,''值时会把他当成null值而显示placeholder
```html
<search-select :options="options" v-model:value="selectedID" :conv="conv" :as-null-values="[]"/>
```
