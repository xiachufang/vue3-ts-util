import * as fs from 'fs'
import * as path from 'path'
import { execSync } from 'child_process'

const fsp = fs.promises

const shimsDecl = `
import { defineComponent } from 'vue'
const Component: ReturnType<typeof defineComponent>
export default Component
`

const getVueFile = async (dir: string) => {
  const vueFiles = new Array<string>()
  for await (const file of await fsp.opendir(dir)) {
    if (file.isDirectory()) {
      vueFiles.push(...await getVueFile(path.join(dir, file.name)))
    } else if (file.isFile() && file.name.endsWith('vue')) {
      vueFiles.push(path.join(dir, file.name))
    }
  }
  return vueFiles
}


const vuefilePath2decl = (v: string) => v.replace('.vue', '.vue.d.ts')

export const genVueType = async (startDir = 'src') => {
  // 遍历获取vue文件的路径
  const vueFiles = await getVueFile(startDir)
  // 给这些vue文件创建一个临时的声明文件，能正确编译就行
  await Promise.all(vueFiles.map(path => fsp.writeFile(vuefilePath2decl(path), shimsDecl)))
  execSync('yarn build') // 编译
  await Promise.all(vueFiles.map(async path => {
    // 读取编译好生成的类型文件，写回原来的地方
    const tsDeclFilePath = vuefilePath2decl(path.replace('src/', 'es/'))
    const generatedTsDeclFile = await fsp.readFile(tsDeclFilePath)
    await fsp.writeFile(vuefilePath2decl(path), generatedTsDeclFile)
  }))
  console.log('成功生成以下声明文件', vueFiles.map(vuefilePath2decl))
}


const errHint = `
生成失败
查看是不是或者没有正确的引用，或者是被优化掉了，
import xxx from './xxx/index.vue'
console.log(xxx）
是最简单的避免被优化掉的方法
`
export const startGenVueType = () =>
  genVueType().catch(err => {
    console.error(err)
    console.error(errHint)
  })
