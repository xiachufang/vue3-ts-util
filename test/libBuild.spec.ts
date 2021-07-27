import { execSync } from 'child_process'
import * as path from 'path'
import * as fs from 'fs'
describe('测试构建完是否可以运行', () => {
  const esIdx = '../es/src/index'
  beforeAll(() => {
    if (fs.existsSync(esIdx)) {
      console.log(`跳过编译及优化`)
      return
    }
    execSync(`yarn build`)
    execSync(`yarn import-optimization`)
  })
  it('测试是否可以运行', () => {
    require(path.resolve(__dirname, esIdx))
  })
})
