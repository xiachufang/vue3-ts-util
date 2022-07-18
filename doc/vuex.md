- [mutation 生成mutation函数的辅助函数](#mutation-生成mutation函数的辅助函数)
- [VuexPersistence 用于持久化的vuex插件](#vuexpersistence-用于持久化的vuex插件)
  - [feature](#feature)
  - [最小化例子](#最小化例子)

desc: vuex相关的
# mutation 生成mutation函数的辅助函数
```ts
const mutationSetter = mutation<AnnotationState>()

const mutations = {
  setTagList: mutationSetter('tagList') // 将会提供所有的key给你选择
}

// 等价于

const mutations = {
  setTagList(state: AnnotationState, tagList: Tag[]) {
    state.tagList = tagList
  }
}
```

# VuexPersistence 用于持久化的vuex插件
## feature
1. 监控mutations的commit并持久化
2. 支持自定义序列化和反序列化
3. 支持设置过期时间
4. 支持设置名称空间，对微前端友好
5. 由vuex-dispatch-infer提供类型推导，从mutation type中直接推存储键名，不需要再去思考名字
## 最小化例子
```ts
// src/store/app.ts
const state = (): AppState => ({
  isSuperUser: persistence.get('app/setSu').or(false) // 从持久化中获取，如果没找到则使用false
})

const mutationSetter = mutation<AppState>()

const mutations = {
  setSu: mutationSetter('isSuperUser')
}

export default {
  namespaced: true,
  state,
  mutations
}


// src/store/index.ts
import app from './app.ts'
import { GetOverloadDict } from 'vuex-dispatch-infer'

type StoreParams = { modules: { app: typeof app } }
type Mutations = keyof GetOverloadDict<StoreParams, 'mutations'>
export const persistence = new VuexPersistence<Mutations>('ciallo')

export const store = createStore({
  modules: {
    app
  },
  plugins: [persistence.watch([
    'app/setSu', // 最简单的用法，不过期，使用json进行序列化和反序列化，名字会帮你推出来
    { // 需要自定义可以用object的选项来替代上面的那个
      type: 'app/setSu', // type是必要的，其他的是可选的
      expire: moment.duration(1, 'h'), // 下次打开页面时如果距离上次修改超过一小时会删除
      serialize: v => v ? '1' : '', // 自定义序列化方法
      deserialize: str => !!str
    }
  ])]
})

store.commit('app/setSu', true) // 在每次commit时会保存到本地，下次打开时恢复
```
