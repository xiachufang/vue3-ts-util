import { execSync } from 'child_process'
import * as path from 'path'
import * as fs from 'fs'
describe.only('测试构建完是否可以运行,主要是看优化脚本是否可以运行', () => {
  const esPath = path.resolve(__dirname, '../es/src/index.js')
  beforeAll(() => {
    if (fs.existsSync(esPath)) {
      console.log(`跳过编译`)
      execSync(`yarn import-optimization`)
      return
    }
    execSync(`yarn build`)
    execSync(`yarn import-optimization`)
  })
  it('测试是否可以运行', () => {
    require(esPath)
  })
})
