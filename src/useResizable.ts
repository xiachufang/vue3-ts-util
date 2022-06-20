import { useMouseInElement } from '@vueuse/core'
import { useGesture, useMove } from '@vueuse/gesture'
import { computed, reactive, ref, Ref } from 'vue'
import { ok } from '.'
import { truthy } from './truthy'
import { useDomRect } from './useDomRect'
interface Point {
  x: number
  y: number
}

const twoPointDistance = (a: Point, b: Point) => Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2))
export const useResizable = (ele: Ref<HTMLElement | undefined>, initRect: { width: number, height: number; x: number; y: number }, triggerWidth = 50) => {
  const rect = reactive(initRect)
  const pressed = ref(false)
  const { rect: domRect } = useDomRect(ele)
  const cursorCss = ref('')
  const { isOutside } = useMouseInElement(ele)
  const getTriggerAreaInfo = (p: Point) => {
    const { height, width } = truthy(domRect.value)
    const [left, top] = [rect.x, rect.y]
    const resize = ([
      [left, top, 'tl', 'nw-resize'], // tl => top-left
      [left + width, top, 'tr', 'ne-resize'],
      [left, top + height, 'bl', 'sw-resize'],
      [left + width, top + height, 'br', 'se-resize']
    ] as const)
      .find(target => twoPointDistance({ x: target[0], y: target[1] }, p) <= triggerWidth)
    if (resize) {
      return resize.slice(2) as string[]
    }
    if (!isOutside.value) {
      return ['drag', 'move']
    }
    ok(false, "unreachable code")
  }

  let lastUserSelect = ''
  const onStart = () => {
    lastUserSelect = document.body.style.userSelect
    document.body.style.userSelect = 'none'
    pressed.value = true
  }
  const onEnd = () => {
    document.body.style.userSelect = lastUserSelect
    pressed.value = false
  }

  useGesture({ onMousedown: onStart }, { domTarget: ele })
  useGesture({ onMouseup: onEnd, onMouseleave: onEnd }, { domTarget: document.body })
  useMove(({ xy, event }) => {
    if (isOutside.value) {
      return
    }
    const [type, cursor] = getTriggerAreaInfo({ x: xy[0], y: xy[1] })
    cursorCss.value = cursor
    if (!pressed.value) {
      return
    }
    const offsetX = event.movementX
    const offsetY = event.movementY
    switch (type) {
      case 'tl':
        rect.x += offsetX
        rect.y += offsetY
        rect.width -= offsetX
        rect.height -= offsetY
        break
      case 'tr':
        rect.width += offsetX
        rect.y += offsetY
        rect.height -= offsetY
        break
      case 'bl':
        rect.height += offsetY
        rect.width -= offsetX
        rect.x += offsetX
        break
      case 'br':
        rect.width += offsetX
        rect.height += offsetY
        break
      case 'drag':
        rect.x += offsetX
        rect.y += offsetY
    }
    return
  }, { domTarget: document.body })
  return {
    styleObj : computed(() => ({
      top: rect.y,
      left: rect.x,
      width: rect.width,
      height: rect.height,
      cursor: cursorCss.value
    })),
    style: computed(() => `;top:${rect.y}px;left:${rect.x}px;padding:8px;border:1px solid black;z-index: 100;width:${rect.width}px;height: ${rect.height}px;cursor:${cursorCss.value};`),
  }
}
