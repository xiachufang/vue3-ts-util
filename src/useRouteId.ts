import { useRoute } from 'vue-router'
import { deepReadonly } from './readonly'

export const useRouteId = () => {
  const { params } = useRoute()
  const id = +params.id
  const isVaild = id !== 0 && !isNaN(id)
  return deepReadonly({
    src: id,
    srcStr: params.id as string,
    isVaild
  })
}
