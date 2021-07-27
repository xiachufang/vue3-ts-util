import * as fs from 'fs'

import * as path from 'path'

/**
 * 在原有基础进行更深层次的tree-shaking优化，原理是把副作用的引入改到fade module内，就是做法不怎么优雅
 * 这种东西应该在vue rollup的插件里就存在选项，但是我没找到
 */

const fsp = fs.promises

const traverse = async (dir: string) => {
  for await (const file of await fsp.opendir(dir)) {
    if (file.isDirectory()) {
      await traverse(path.join(dir, file.name))
    } else if (file.isFile() && file.name.endsWith('.js')) {
      const filePath = path.join(dir, file.name)
      const fileBuf = fs.readFileSync(filePath)
      const scheme = /^(.*)\.vue\.js$/.exec(file.name)?.[1] // file name , button.vue.js => button
      const isImportSelf = (line: string) => /^(import|export)/.test(line) && line.includes(`./${scheme}.vue_vue`)// 判断是否是在引入自己组件的副作用
      const reWriteLines = fileBuf
        .toString()
        .split('\n')
        .filter(line => isImportSelf(line) || !/\.(css|vue)\.js/.test(line)) // 删除副作用的导入
        // button.vue_vue&type=script&lang.js => button.vue.js
        // 导出vue组件的script，改成导出fade module，副作用在fade module内导入
        .map(line => isImportSelf(line) ? line : line.replace('_vue&type=script&lang', ''))
      fs.writeFileSync(filePath, reWriteLines.join('\n'))
    }
  }
}

traverse('es/src')
