import loadConfigFile from 'rollup/dist/loadConfigFile'
import path from 'path'
import * as fs from 'fs'
import * as rollup from 'rollup'
import { execSync } from 'child_process'
import { dayjsConvert } from '../src/dayjsConvert'


interface DevWatchConf {
  symlink?: string
}
const fsp = fs.promises

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
          if (symlink) {
            {
              const target = path.resolve(symlink, 'node_modules', 'vue3-ts-util')
              await fsp.rm(target, { recursive: true, force: true })
              await fsp.symlink(path.resolve(__dirname, '..'), target)
            }
          }
        }
        console.log(dayjsConvert(dayjsConvert()), e.code)
      })

    }
  )
}
