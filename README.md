# vue3-ts-util
vue3-ts-util是下厨房几个vue3后台的通用函数，组件库。
使用ts编写而成，组件使用模板及少量tsx。

[![Node.js CI](https://github.com/xiachufang/vue3-ts-util/actions/workflows/ci.yml/badge.svg)](https://github.com/xiachufang/vue3-ts-util/actions/workflows/ci.yml)
[![](https://img.shields.io/npm/v/vue3-ts-util.svg)](https://www.npmjs.com/package/vue3-ts-util)


# 用法
`yarn add vue3-ts-util`

# 编译体积优化
vue3-ts-util有两个构建版本
## ESM构建版本
编译目标为es6，模块标准为es6，也是最主要使用的版本。优点是支持tree shaking。
### 效果
参考这个issue https://github.com/xiachufang/vue3-ts-util/issues/4

### tree shaking没起作用？
1. 将webpack.config.js的optimization.sideEffects设为true
2. 确保打包器内部的loader使用es module进行编译
    1. tsc的模块标准为es module，有些直接在tsconfig.json就可以设置，有些需要传到加载器或者插件的参数里
    2. babel的模块标准为es module，参考https://babeljs.io/docs/en/babel-preset-env#modules

如果上述无效可以参考这2篇文章
1. [webpack tree-shaking](https://webpack.docschina.org/guides/tree-shaking/#root)
2. [library-tree-shaking](https://blog.theodo.com/2021/04/library-tree-shaking/)
## commonjs的兼容构建版本
编译目标为es5，模块标准为commonjs，仅作为部分情况下的兼容，例如直接使用node运行

# 进一步优化
1. 替换掉moment，主要是不支持tree-shaking
