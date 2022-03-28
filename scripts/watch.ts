import loadConfigFile from 'rollup/dist/loadConfigFile'
import path from 'path'
import * as fs from 'fs'
import * as rollup from 'rollup'
import { importOptimize } from './importOptimize'
import { execSync } from 'child_process'
import { momentConvert } from '../src/momentConvert'


interface DevWatchConf {
  symlink?: string
}

/**
 * 文件修改 -> 编译打包 -> import优化 -> 复制到目标文件夹内
 */

export const devWatch = async () => {
  const confPath = 'scripts/conf.json'
  const symlink = (JSON.parse(fs.existsSync(confPath) ? fs.readFileSync(confPath).toString() : '{}')?.devWatch as DevWatchConf)?.symlink
  loadConfigFile(path.resolve('rollup.config.js')).then(
    async ({ options, warnings }) => {
      console.log(`We currently have ${warnings.count} warnings`)
      warnings.flush()
      for (const optionsObj of options) {
        const bundle = await rollup.rollup(optionsObj)
        await Promise.all(optionsObj.output.map(bundle.write))
      }
      rollup.watch(options).on('event', async e => {
        if (e.code === 'ERROR') {
          console.error(e.error)
        }
        if (e.code === 'END') {
          await importOptimize('es/src') // import优化在开发时对性能的提升其实是无所谓的，主要是怕优化出现问题，这样可以提现暴露
          if (symlink) { // 尝试了使用符号链接，但是也出现了readme中在”ref在改变后够观测不到“的问题
            {
              const target = path.resolve(symlink, 'node_modules', 'vue3-ts-util', 'es')
              execSync(`rm -rf ${target}`)
              execSync(`mv ${path.resolve(__dirname, '../es')} ${target}`) // 不使用fs.copy是因为node14的fs有bug，15才修复
            }
            {
              const target = path.resolve(symlink, 'node_modules', 'vue3-ts-util', 'dist')
              execSync(`rm -rf ${target}`)
              execSync(`mv ${path.resolve(__dirname, '../dist')} ${target}`)
            }
          }
        }
        console.log(momentConvert(momentConvert()), e.code)
      })

    }
  )
}
