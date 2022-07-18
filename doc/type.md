- [globalComponents](#globalcomponents)
- [DeepReadonly转换一个类型为深度只读](#deepreadonly转换一个类型为深度只读)
  - [仅使用类型](#仅使用类型)
  - [也可以使用这种方式](#也可以使用这种方式)
- [ok 先验条件断言](#ok-先验条件断言)
- [thruthy 真值断言](#thruthy-真值断言)
- [Columns 描述antd表格结构的类型](#columns-描述antd表格结构的类型)
- [Image 下厨房的图像结构](#image-下厨房的图像结构)
- [WithRequired 将对象部分字段转为不可空](#withrequired-将对象部分字段转为不可空)
- [customPropType vue props用于推导自定义类型的辅助函数,使用interface风格写props](#customproptype-vue-props用于推导自定义类型的辅助函数使用interface风格写props)
desc: 类型及类型推导辅助相关

# globalComponents
给volar提给该库组件的类型提示
# DeepReadonly转换一个类型为深度只读
## 仅使用类型
<img width="521" alt="image" src="https://user-images.githubusercontent.com/25872019/178920881-90190884-bd1e-421c-a96d-383c019ac873.png">

## 也可以使用这种方式
```ts
function getADeepReadonlyObject() {
  return deepReadonly({
    foo: 'caillo'
  })
}
```
# ok 先验条件断言
断言除了用于测试外还用于先验条件，即检测接下来代码的执行，如果条件不满足则断言失败抛异常或者退出进程。和异常不同，断言失败只应该发生在开发阶段，如果断言失败那么就是你代码写错了，而异常则可能是由于外界条件的不足。
将断言用于先验条件这种做法在一些编译型语言上尤其流行，这些断言在debug编译时生效，release编译时又会被移除。
在ts中除了先验条件外，断言还支持用于控制流的类型推导。
```ts
ok(typeof next === 'string')
ok(ele)
```
# thruthy 真值断言
和非空断言有点像，好处是会更早引发断言失败
```ts
let numMayBeNull: number | null
doSomething(numMayBeNull!) // 如果函数没校验，可能会随着多次传递而难以debug
doSomething(thruthy(numMayBeNull)) // 函数未调用就断言失败
```
# Columns 描述antd表格结构的类型
主要是用于推导antd表格，方便在ts里描述antd表格的行列
<img width="674" alt="image" src="https://user-images.githubusercontent.com/25872019/178931363-5766a7ce-4a03-4403-ae60-7abfcc0c152c.png">
<img width="784" alt="image" src="https://user-images.githubusercontent.com/25872019/178931457-cb968a57-698f-4092-954f-90b05cab9a52.png">

# Image 下厨房的图像结构
# WithRequired 将对象部分字段转为不可空

```ts

type AllOptional = {
  str?: string;
  num?: number;
  bool?: boolean
}

type SomeOptional = WithRequired<AllOptional, 'str' | 'bool'>
```
# customPropType vue props用于推导自定义类型的辅助函数,使用interface风格写props
适用于vue2/3,例子直接看本库的组件就行，如果你使用vue3的setup我更推荐使用[defineProps](https://v3.cn.vuejs.org/api/sfc-script-setup.html#defineprops-%E5%92%8C-defineemits)，这个只是不能直接书写props interface时的一个workaround
```ts
props: {
 seg: customPropsType<SegParams>(), // 非空，自定义接口
 getState: customPropsType<(id: number) => ArchState>(false), // 可空，函数
 enable: customPropsType<boolean>(false, Boolean) // 可空，运行时类型检查,
 direction: customPropType((): 'vertical' | 'horizontal' => 'horizontal') // 默认参数
 }
```
<img width="596" alt="image" src="https://user-images.githubusercontent.com/25872019/178933637-4947d05a-a3fb-4462-9acc-04840ec5254c.png">
