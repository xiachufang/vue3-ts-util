import moment from 'moment'
import { Plugin, Store } from 'vuex'
import { truthy } from '../truthy'
import { WithRequired } from '../typedef'

type WatchOptions<Mutation extends string> = {
  type: Mutation
  expire?: moment.Duration
  serialize?: (v: any) => string
  deserialize?: (s: string) => any
}

type ActionType<Mutation extends string> = Mutation | WatchOptions<Mutation>

/**
 * 持久化
 */
export class VuexPersistence<
  Mutation extends string = string,
  RS = any
  > {
  private watchType: ActionType<Mutation>[] = []
  // eslint-disable-next-line no-useless-constructor
  constructor(private namespace = '') { }
  watch (watchType: ActionType<Mutation>[]) {
    this.watchType.push(...watchType)
    const plugin: Plugin<RS> = (store: Store<RS>) => {
      store.subscribe(({ type, payload }) => {
        const conf = this.getConf(type as Mutation)
        if (conf) {
          this.set(conf.type, payload)
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
    const conf = truthy(this.getConf(type))
    const serializeVal = localStorage.getItem(this.getStorageName(type))
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
            if (conf.expire) {
              const lastUpdatedTimeStr = localStorage.getItem(this.getStorageLastUpdatedTimeName(conf.type))
              if (lastUpdatedTimeStr && moment(lastUpdatedTimeStr).add(conf.expire).isBefore()) {
                localStorage.removeItem(this.getStorageLastUpdatedTimeName(conf.type))
                throw new Error(`expired type:${conf.type}`)
              }
            }
            const storeVal = conf.deserialize(serializeVal)
            return typeof storeVal === 'object' && mergeIfObject ? { ...defaultVal, ...storeVal } : storeVal
          } catch (error) {
            localStorage.removeItem(this.getStorageName(type))
            if (error instanceof Error && error.message.includes('expired')) {

            } else {
              console.error(`deserialize fail. type:${type} error:${error}`)
            }
          }
        }
        return defaultVal
      },
      serializeVal
    }
  }

  private set (type: Mutation, payload: any) {
    const conf = truthy(this.getConf(type))
    localStorage.setItem(this.getStorageName(conf.type), (conf.serialize)(payload))
    if (conf.expire) {
      localStorage.setItem(this.getStorageLastUpdatedTimeName(conf.type), moment().toString())
    }
  }

  private getStorageName (type: Mutation) {
    return `${this.namespace}@${type}`
  }

  private getStorageLastUpdatedTimeName (type: Mutation) {
    return `${this.namespace}@${type}:LastUpdatedTime`
  }

  private getConf (type: ActionType<Mutation>) {
    const defaultConf = {
      serialize: JSON.stringify, deserialize: JSON.parse
    }
    type Conf = WithRequired<WatchOptions<Mutation>, 'deserialize' | 'serialize'>
    if (typeof type === 'object') {
      return { ...defaultConf, ...type } as Conf
    }
    const conf = this.watchType.find(v => {
      if (typeof v === 'string') {
        return v === type
      }
      return v.type === type
    })
    if (!conf) {
      return null
    }
    const res = typeof conf === 'string' ? { type: conf, ...defaultConf } : { ...defaultConf, ...conf }
    return res as Conf
  }
}
