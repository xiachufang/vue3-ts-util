import { range } from 'lodash'
import { ID, idKey } from '../src'
describe('ID生成', () => {

  it('使用ID函数进行id生成', () => {
    const a = {}
    ID(a)
    expect(a[idKey]).toBeTruthy()
  })

  it('使用ID函数生成的id都为唯一', () => {
    const ids = new Set<symbol>()
    range(100).forEach(() => {
      ids.add(ID({})[idKey])
    })
    expect(ids.size).toBe(100)
  })

})
