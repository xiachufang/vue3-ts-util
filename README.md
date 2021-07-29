# vue3-ts-util
vue3-ts-util是下厨房几个vue3后台的通用函数，组件库。
使用ts编写而成，组件使用模板及少量tsx。

[![Node.js CI](https://github.com/xiachufang/vue3-ts-util/actions/workflows/ci.yml/badge.svg)](https://github.com/xiachufang/vue3-ts-util/actions/workflows/ci.yml)
[![](https://img.shields.io/npm/v/vue3-ts-util.svg)](https://www.npmjs.com/package/vue3-ts-util)


# 安装
`yarn add vue3-ts-util`


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
# 开发
```bash
git clone ....
cd vue3-ts-util
yarn 
....
```
## 开发新功能及debug
在scripts的文件夹下创建conf.json
```json
{
  "devWatch": {
    "symlink": "/Users/zanllp/try-fluent-design"
  }
}
```
`symlink`指向你开发&debug用的项目，再
```bash
yarn dev-watch # 开启即时编译
```
直接在这边修改src下面ts,tsx,vue,就可以即时在那边生效。做到近似在同一个项目内开发的体验。


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
## 在开发时需要遵守
1. vue组件的类型声明应该使用`yarn gen-vue-type`来自动生成，而不是手写或者使用shims,使用shims会丢失props的类型信息。对于props的声明应该尽量`customPropType`，可以尽可能接近写interface的体验
2. 对于外部不可变的值(例如`strictQueue的loading`)应该对返回值加`deepReadonly`,可以对这类ref做到类型层面的只读，更狠一点可以
```ts
const foo = () => {
    const loading = ref(true)
    return {
        bar: computed(() => loading.value)
    }
}
```
3. 尽可能足够的单元测试
4. 

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
# 进一步优化
1. 替换掉moment，体积又大还不支持tree-shaking
