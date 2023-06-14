# vue3-ts-util
vue3-ts-util是下厨房几个vue3后台的通用函数，组件库。
使用ts编写而成，组件使用模板及少量tsx。

[![Node.js CI](https://github.com/xiachufang/vue3-ts-util/actions/workflows/ci.yml/badge.svg)](https://github.com/xiachufang/vue3-ts-util/actions/workflows/ci.yml)
[![](https://img.shields.io/npm/v/vue3-ts-util.svg)](https://www.npmjs.com/package/vue3-ts-util)

# 安装
`yarn add vue3-ts-util`

> 按需可能会要求对等依赖 vue vuex vue-router，执行yarn add

# 用法
见文档[doc](doc)
目录见下方

<!--docinsert-->
##  vue3 composition api的hook
- [useDomRect hook风格获取dom的rect](./doc/hooks.md#usedomrect-hook风格获取dom的rect)
- [useEmit 用于在hook内emit](./doc/hooks.md#useemit-用于在hook内emit)
- [useFetchQueueHelper/useStrictQueue/useRetryableQueue fetchqueue的hook wrapper](./doc/hooks.md#usefetchqueuehelperusestrictqueueuseretryablequeue-fetchqueue的hook-wrapper)
- [useInfiniteScrolling 无限滚动](./doc/hooks.md#useinfinitescrolling-无限滚动)
- [useResizeable 用于鼠标拖拽调整调整某个元素的大小位置](./doc/hooks.md#useresizeable-用于鼠标拖拽调整调整某个元素的大小位置)
- [useStackAlloc hook风格管理object url分配](./doc/hooks.md#usestackalloc-hook风格管理object-url分配)
- [useWatchDocument `document.addEventListener`的hook wrapper](./doc/hooks.md#usewatchdocument-documentaddeventlistener的hook-wrapper)
- [createTypedShareStateHook/useHookShareState 生成一个实例内进行状态共享的hook](./doc/hooks.md#createtypedsharestatehookusehooksharestate-生成一个实例内进行状态共享的hook)
- [useRouteId 路由参数id获取，合法判断](./doc/hooks.md#userouteid-路由参数id获取合法判断)

##  输入输出，网络请求相关的
- [FetchQueue 自动管理loading等的请求控制容器](./doc/io.md#fetchqueue-自动管理loading等的请求控制容器)
  - [构造参数](./doc/io.md#构造参数)
  - [类方法/属性](./doc/io.md#类方法属性)
  - [pushAction返回的任务实例](./doc/io.md#pushaction返回的任务实例)
  - [例子](./doc/io.md#例子)
    - [最小化](./doc/io.md#最小化)
    - [排队执行，失败自动重试](./doc/io.md#排队执行失败自动重试)
    - [取消任务，监听任务被取消](./doc/io.md#取消任务监听任务被取消)
    - [给任务添加标识/额外信息](./doc/io.md#给任务添加标识额外信息)
    - [让FetchQueue成为响应式](./doc/io.md#让fetchqueue成为响应式)
  - [更多的例子见单元测试,测试要详细的多](./doc/io.md#更多的例子见单元测试测试要详细的多)
  - [衍生hooks](./doc/io.md#衍生hooks)
- [Task 轮训请求的控制](./doc/io.md#task-轮训请求的控制)
  - [参数](./doc/io.md#参数)
  - [返回值](./doc/io.md#返回值)
    - [停止轮训](./doc/io.md#停止轮训)
    - [获取轮训结果](./doc/io.md#获取轮训结果)
    - [获取轮训参数](./doc/io.md#获取轮训参数)
  - [一个简单的例子](./doc/io.md#一个简单的例子)
- [makeAsyncIter 分页api的迭代管理](./doc/io.md#makeasynciter-分页api的迭代管理)
  - [返回类型](./doc/io.md#返回类型)
  - [一个简单的例子](./doc/io.md#一个简单的例子-1)
  - [控制多资源，内部状态重置](./doc/io.md#控制多资源内部状态重置)
  - [中断之前的请求](./doc/io.md#中断之前的请求)
  - [返回类型的约束](./doc/io.md#返回类型的约束)
  - [在vue2 options api中使用](./doc/io.md#在vue2-options-api中使用)
  - [在小程序中使用](./doc/io.md#在小程序中使用)
    - [最小无限滚动加载收藏的例子](./doc/io.md#最小无限滚动加载收藏的例子)
    - [在ts/js中获取asyncIter的状态](./doc/io.md#在tsjs中获取asynciter的状态)
    - [在wxml中获取asyncIter的状态](./doc/io.md#在wxml中获取asynciter的状态)
      - [通过设置回调来实现状态变化时更新 setStateUpdatedCallback](./doc/io.md#通过设置回调来实现状态变化时更新-setstateupdatedcallback)
      - [简写方式 bindPage](./doc/io.md#简写方式-bindpage)
    - [如何知道asyncIter引发的界面修改完成时机](./doc/io.md#如何知道asynciter引发的界面修改完成时机)
  - [常用场景的使用](./doc/io.md#常用场景的使用)
    - [antd表格翻页](./doc/io.md#antd表格翻页)
    - [无限滚动](./doc/io.md#无限滚动)
- [useInfiniteScrolling 无限滚动](./doc/io.md#useinfinitescrolling-无限滚动)
  - [探底触发](./doc/io.md#探底触发)
  - [交叉触发模式](./doc/io.md#交叉触发模式)
  - [](./doc/io.md#)
  - [hooks](./doc/io.md#hooks)
- [useAntdListPagination / GeneralPagination  翻页管理](./doc/io.md#useantdlistpagination--generalpagination--翻页管理)
  - [使用参考](./doc/io.md#使用参考)

##  其余不好分类的函数
- [deepComputed](./doc/other.md#deepcomputed)
  - [主要的使用场景](./doc/other.md#主要的使用场景)
  - [性能相关](./doc/other.md#性能相关)
  - [需要注意的问题](./doc/other.md#需要注意的问题)
    - [如果发现修改了值但setter没被调用](./doc/other.md#如果发现修改了值但setter没被调用)
    - [调用了一次值的函数(例如Array::splice)，但是setter被多次调用？](./doc/other.md#调用了一次值的函数例如arraysplice但是setter被多次调用)
    - [原因](./doc/other.md#原因)
    - [解决方法](./doc/other.md#解决方法)
- [deepComputedEffect 更好的deepComputed](./doc/other.md#deepcomputedeffect-更好的deepcomputed)
- [deepComputedPick 执行后二值之间仍然会双向同步的pick](./doc/other.md#deepcomputedpick-执行后二值之间仍然会双向同步的pick)
- [deepProxy让defineModel也能进行深度响应](./doc/other.md#deepproxy让definemodel也能进行深度响应)
- [events/typedEventEmitter 类型安全的EventEmitter](./doc/other.md#eventstypedeventemitter-类型安全的eventemitter)
- [image/getImageUrl 从下厨房用的图像结构构造url](./doc/other.md#imagegetimageurl-从下厨房用的图像结构构造url)
- [assigIncrId 生成一个全局自增id](./doc/other.md#assigincrid-生成一个全局自增id)
- [unid/typedID/ID 使用symbol实现的ID生成器](./doc/other.md#unidtypedidid-使用symbol实现的id生成器)
- [delay,delayFn 延时，推迟控制流执行](./doc/other.md#delaydelayfn-延时推迟控制流执行)
- [promise2ref promise转成ref](./doc/other.md#promise2ref-promise转成ref)
- [promiseSetRef 在promise完成时设置某个ref](./doc/other.md#promisesetref-在promise完成时设置某个ref)
- [dayjsConvert 一个函数实现下厨房常用的多种时间转换](./doc/other.md#dayjsconvert-一个函数实现下厨房常用的多种时间转换)

##  类型及类型推导辅助相关
- [globalComponents](./doc/type.md#globalcomponents)
- [DeepReadonly转换一个类型为深度只读](./doc/type.md#deepreadonly转换一个类型为深度只读)
  - [仅使用类型](./doc/type.md#仅使用类型)
  - [也可以使用这种方式](./doc/type.md#也可以使用这种方式)
- [ok 先验条件断言](./doc/type.md#ok-先验条件断言)
- [thruthy 真值断言](./doc/type.md#thruthy-真值断言)
- [Columns 描述antd表格结构的类型](./doc/type.md#columns-描述antd表格结构的类型)
- [Image 下厨房的图像结构](./doc/type.md#image-下厨房的图像结构)
- [WithRequired 将对象部分字段转为不可空](./doc/type.md#withrequired-将对象部分字段转为不可空)
- [customPropType vue props用于推导自定义类型的辅助函数,使用interface风格写props](./doc/type.md#customproptype-vue-props用于推导自定义类型的辅助函数使用interface风格写props)

##  本库的vue3组件
- [GeneralPagination 翻页器和相关hook](./doc/vue3components.md#generalpagination-翻页器和相关hook)
- [SplitView 支持鼠标拖拽调整的视图分割](./doc/vue3components.md#splitview-支持鼠标拖拽调整的视图分割)
  - [props](./doc/vue3components.md#props)
  - [例子](./doc/vue3components.md#例子)
- [SearchSelect 支持搜索的选择，追求尽可能少的代码来描述](./doc/vue3components.md#searchselect-支持搜索的选择追求尽可能少的代码来描述)
  - [props](./doc/vue3components.md#props-1)
  - [例子](./doc/vue3components.md#例子-1)

##  vuex相关的
- [mutation 生成mutation函数的辅助函数](./doc/vuex.md#mutation-生成mutation函数的辅助函数)
- [VuexPersistence 用于持久化的vuex插件](./doc/vuex.md#vuexpersistence-用于持久化的vuex插件)
  - [feature](./doc/vuex.md#feature)
  - [最小化例子](./doc/vuex.md#最小化例子)

<!--docinsert-->
# 开发
> rollup-plugin-vue已经没维护，出现问题搞不定可以考虑vite
## 下载
```bash
git clone ....
cd vue3-ts-util
yarn
....
```
## 使用dev-watch开发新功能及debug
大部分功能使用单元测试即可完成。

如果想要在其他项目中进行开发测试可以这么操作,以一个vite项目为例
### 修改vite配置，使其能监听变化
不需要实时watch的可以跳过
```ts
import { defineConfig, searchForWorkspaceRoot, UserConfig } from 'vite'


export default defineConfig({
  optimizeDeps: {
    exclude: ['vue3-ts-util'] // 监听这个包的变化
  },
  server: {
    watch: {
      ignored: ['!**/node_modules/vue3-ts-util/es/**'],
    },
    fs: {
      allow: [
        searchForWorkspaceRoot(process.cwd()),
        // 自定义规则
        '/Users/xxxxxx/project/vue3-ts-util' // 本项目地址
      ]
    }
  }
})
```
### 创建符号链接，启动编译监听
在scripts的文件夹下创建conf.json
```json
{
  "devWatch": {
    "symlink": "/Users/zanllp/try-fluent-design" // 直接在命令行里输入pwd获取
  }
}
```
`symlink`指向你开发&debug用的项目, 上面这个操作也可以通过npm link/yarn link 等代替,但是我感觉还不如直接用这个symlink, see https://github.com/yarnpkg/yarn/issues/1957。

再
```bash
yarn dev-watch # 开启即时编译
```
直接在这边修改src下面ts,tsx,vue,就可以即时在那边生效。做到近似在同一个项目内开发的体验。

需要注意的是关闭后目标项目还是使用的最后构建的包，如果需要改回去重新安装一遍`vue3-ts-util`就行
## npm scripts说明
### 预发行
```
yarn pre-release
```
再改下版本号，`npm publish`即可发包
### 即时编译
```
dev-watch
```
### import 优化
```
yarn import-optimize
```
可以在编译完的基础上进一步增强tree-shaking的效果，原理看scriprt文件夹下对应文件
### vue文件的类型声明文件生成
```
yarn gen-vue-type
```
### 编译
```
yarn build
```
### 清理编译产物
```
yarn clean
```
### 单元测试
```
yarn test
```
## 一些需要注意的地方
1. vue组件的类型声明应该使用`yarn gen-vue-type`来自动生成，而不是手写或者使用shims,使用shims会丢失props的类型信息。对于props的声明应该尽量`customPropType`，可以尽可能接近写interface的体验(setup的更好，直接defineProps)
2. 如果需要返回一个外部不可修改的对象可以使用`deepReadonly`
3. 修改文档后使用vscode的markdown in one更新所在文件的目录，然后使用`yarn gen-contents`生成合并的目录写入到readme<img width="623" alt="image" src="https://user-images.githubusercontent.com/25872019/179443451-6c974bf3-18d8-463f-a4df-1dcb0f787086.png">
4. 尽可能足够的单元测试
5. 如果修改了组件相关及时修改vetur下的文件，及volar所使用的`src/globalComponents.ts`
6. 版本号修改参考https://semver.org/lang/zh-CN/



# 编译体积优化
vue3-ts-util有两个构建版本，使用ESM构建版本可以有效的减少编译后的体积
## ESM构建版本
编译目标为es6，模块标准为es6，也是最主要使用的版本。优点是支持tree shaking。
### 效果
参考这个issue https://github.com/xiachufang/vue3-ts-util/issues/4

### tree shaking没起作用？
1. 将webpack.config.js的optimization.sideEffects设为true
2. 确保打包器内部的loader使用es module进行编译
    1. tsc有些直接在tsconfig.json就可以设置，有些需要传到加载器或者插件的参数里
    2. babel参考https://babeljs.io/docs/en/babel-preset-env#modules

如果上述无效可以参考这2篇文章
1. [webpack tree-shaking](https://webpack.docschina.org/guides/tree-shaking/#root)
2. [library-tree-shaking](https://blog.theodo.com/2021/04/library-tree-shaking/)
## commonjs的兼容构建版本
编译目标为es5，模块标准为commonjs，仅作为部分情况下的兼容，例如直接使用node运行

# 一些问题的处理方法
## ref在改变后够观测不到
可以查看是否存在着多个vue实例，即vue3-ts-util和其他的组件不在同一个vue实例内，vue3-ts-util的ref另外一个实例收集不到。可以看看node_modules里面vue3-ts-util是否存在一个单独的vue安装，可以通过改变2者的npm package的vue版本依赖限制来解决这个问题
## 在使用项目上线存在与本地开发时不一致的问题
可以先判断是否是部分文件在编译完被移除掉了，即存在副作用的文件被编译器当成无副作用的处理了。判断可以通过开启source map编译，使用serve打开文件，进入页面后打开devtool的soucre查看是否缺少文件，如果确实是这个原因可以将缺少的文件添加到本项目的`package.json`的`sideEffects`里

当前的`package.json`是这样
```json
{
    "sideEffects": [
    "es/**/*.{vue,css}.js"
  ]
}
```
即匹配`"es/**/*.{vue,css}.js"`的所有文件视为存在副作用，这两个是vue编译器生成的
