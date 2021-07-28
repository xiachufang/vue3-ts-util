import { Plugin, Store } from 'vuex'

type ActionType<Mutation extends string> = Mutation | { type: Mutation, serialize (v: any): string, deserialize (s: string): any }
/**
 * 持久化
 */
export class VuexPersistence<Mutation extends string = string, RS = any> {
  private watchType: ActionType<Mutation>[] = []
  // eslint-disable-next-line no-useless-constructor
  constructor(private namespace = '') { }
  watch (watchType: ActionType<Mutation>[]) {
    this.watchType.push(...watchType)
    const plugin: Plugin<RS> = (store: Store<RS>) => {
      store.subscribe(({ type, payload }) => {
        const conf = this.getConf(type as Mutation)
        if (conf) {
          if (typeof conf === 'object') {
            this.set(conf.type, conf.serialize(payload))
          } else {
            this.set(conf, JSON.stringify(payload))
          }
        }
      })
    }
    return plugin
  }

  /**
 * 从持久化化中获取上次监听的一个值
 * @param type 监听的action类型
 */
  get (type: Mutation) {
    const conf = this.getConf(type)
    const serializeVal = localStorage.getItem(this.getStorageName(type))
    const deserializeMethod = typeof conf === 'object' ? conf.deserialize : JSON.parse
    return {
      /**
       * 给从被获取失败时增加一个默认值
       * @param defaultVal 默认值
       * @param mergeIfObject 为true时合并对象，在不同版本之间升级时类型改变，可以通过获取到旧的通通同时，让缺失的字段使用新的默认值
       * @returns 处理的结果
       */
      or: <T> (defaultVal: T, mergeIfObject = false): T => {
        if (serializeVal) {
          try {
            const storeVal = deserializeMethod(serializeVal)
            return typeof storeVal === 'object' && mergeIfObject ? { ...defaultVal, ...storeVal } : storeVal
          } catch (error) {
            console.error(`deserialize fail. type:${type} error:${error}`)
            localStorage.removeItem(this.getStorageName(type))
          }
        }
        return defaultVal
      },
      serializeVal
    }
  }

  private set (type: Mutation, payload: string) {
    localStorage.setItem(this.getStorageName(type), payload)
  }

  private getStorageName (type: Mutation) {
    return `${this.namespace}@${type}`
  }

  private getConf (type: Mutation) {
    return this.watchType.find(v => {
      if (typeof v === 'string') {
        return v === type
      }
      return v.type === type
    })
  }
}
