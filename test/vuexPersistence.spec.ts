import dayjs from 'dayjs'
import { Store } from 'vuex'

import { ActionType, delay, VuexPersistence } from '../src'

describe('VuexPersistence', () => {
  const createEnv = (conf: ActionType<'setI'> = 'setI') => {
    const persisent = new VuexPersistence()
    const store = new Store({
      plugins: [persisent.watch([conf])],
      state: {
        i: persisent.get('setI').or(0),
      },
      mutations: {
        setI (state, i: number) {
          state.i = i
        },
      },
    })
    return {
      store, persisent,
    }
  }
  beforeEach(() => {
    localStorage.clear()
  })
  it('测试持久化', () => {
    {
      const { store } = createEnv()
      expect(store.state.i).toBe(0)
      store.commit('setI', 1)
      expect(store.state.i).toBe(1)
    }
    {
      const { store } = createEnv()
      expect(store.state.i).toBe(1)
    }
  })
  it('测试自定义序列化', () => {
    {
      const { store } = createEnv({
        type: 'setI',
        serialize: (v: number) => JSON.stringify(Array.from({ length: v }).fill(0)),
        deserialize: str => (JSON.parse(str) as number[]).length
      })
      expect(store.state.i).toBe(0)
      store.commit('setI', 1)
      expect(store.state.i).toBe(1)
    }
    {
      const { store } = createEnv({
        type: 'setI',
        serialize: (v: number) => JSON.stringify(Array.from({ length: v }).fill(0)),
        deserialize: str => (JSON.parse(str) as number[]).length
      })
      expect(store.state.i).toBe(1)
    }
  })

  it('测试过期', async () => {
    {
      const { store } = createEnv({
        type: 'setI',
        expire: dayjs.duration(300, 'ms'),
      })
      expect(store.state.i).toBe(0)
      store.commit('setI', 1)  // 300ms内若不再更新会删除如果再次被读取
      expect(store.state.i).toBe(1)
    }
    await delay(100)
    {
      const { store } = createEnv({
        type: 'setI',
        expire: dayjs.duration(300, 'ms'),
      })
      expect(store.state.i).toBe(1)
    }
    await delay(300)
    {
      const { store } = createEnv({
        type: 'setI',
        expire: dayjs.duration(300, 'ms'),
      })
      expect(store.state.i).toBe(0)
    }
  })
})

class LocalStorageMock implements Storage {
  store: {}
  constructor() {
    this.store = {}
  }
  [name: string]: any
  length: number = 0;
  key (index: number): string | null {
    throw new Error('Method not implemented.')
  }

  clear () {
    this.store = {}
  }

  getItem (key: string) {
    return this.store[key] || null
  }

  setItem (key: string, value: any) {
    this.store[key] = String(value)
  }

  removeItem (key: string) {
    delete this.store[key]
  }
}

global.localStorage ??= new LocalStorageMock()
