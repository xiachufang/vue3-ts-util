import * as fs from 'fs'

import * as path from 'path'

/**
 * 在原有基础进行更深层次的tree-shaking优化，原理是把副作用的引入改到fade module内，就是做法不怎么优雅
 * 这种东西应该在vue rollup的插件里就存在选项，但是我没找到
 */

const fsp = fs.promises

const optimizedMark = '/* import-optimized */'

const traverse = async (dir: string) => {
  for await (const file of await fsp.opendir(dir)) {
    if (file.isDirectory()) {
      await traverse(path.join(dir, file.name))
    } else if (file.isFile() && file.name.endsWith('.js')) {
      const filePath = path.join(dir, file.name)
      const fileBuf = fs.readFileSync(filePath)
      const scheme = /^(.*)\.vue\.js$/.exec(file.name)?.[1] // file name , button.vue.js => button
      const isImportSelf = (line: string) => /^(import|export)/.test(line) && line.includes(`./${scheme}.vue_vue`)// 判断是否是在引入自己组件的副作用
      const reWriteSrcLines = fileBuf.toString().split('\n')
      if (reWriteSrcLines?.[0].includes(optimizedMark)) {
        console.log(`${filePath} \t已优化过，忽略`)
        continue
      }
      const reWriteLines = reWriteSrcLines.filter(line => isImportSelf(line) || !/\.(css|vue)\.js/.test(line)) // 删除副作用的导入
        // button.vue_vue&type=script&lang.js => button.vue.js
        // 导出vue组件的script，改成导出fade module，副作用在fade module内导入
        .map(line => isImportSelf(line) ? line : line.replace('_vue&type=script&lang', ''))
      fs.writeFileSync(filePath, [optimizedMark,...reWriteLines].join('\n')) // 回写，标记已经优化过了，这个不能重复优化
    }
  }
}

traverse('es/src')
