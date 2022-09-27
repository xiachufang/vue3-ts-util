<template>
  <div
    ref="splitContainer"
    class="split-container"
    :class="{ dragging, vertcial: !isHorizontal }"
    @mouseup.capture="switchLKeyState(false)"
    @mousemove="changeSplitPercent"
    @mouseleave="switchLKeyState(false)"
  >
    <div
      class="split-panel"
      :style="`${changedPropetry}:${split}%`"
    >
      <slot name="left" />
    </div>
    <div class="split-div">
      <div class="sense-area" @mousedown="switchLKeyState(true)" />
    </div>
    <div
      class="split-panel"
      :style="`${changedPropetry}:${100 - split}%`"
    >
      <slot name="right" />
    </div>
  </div>
</template>
<script lang="ts">
import { customPropType, deepComputedEffect, useDomRect } from '../'
import { defineComponent, ref, computed } from 'vue'
export default defineComponent({
  props: {
    percent: customPropType(() => 50),
    direction: customPropType((): 'vertical' | 'horizontal' => 'horizontal')
  },
  setup (props, ctx) {
    const isHorizontal = computed(() => props.direction === 'horizontal')
    const splitContainer = ref<HTMLDivElement>()
    const { rect } = useDomRect(splitContainer)
    const range = computed(() => {
      const val = rect.value
      if (!val) {
        return 100
      }
      return isHorizontal.value ? val.width : val.height
    })
    const split = deepComputedEffect({
      get: () => props.percent,
      set: (v) => ctx.emit('update:percent', v)
    })
    let lKeyIsDown = false
    const dragging = ref(false)
    const switchLKeyState = (isDown: boolean) => {
      lKeyIsDown = isDown
      if (!lKeyIsDown) {
        dragging.value = false
      }
    }
    const changeSplitPercent = (event: MouseEvent) => {
      if (lKeyIsDown) {
        dragging.value = true
        const delta = isHorizontal.value ? event.movementX : event.movementY
        // 鼠标移动的像素转换成改变的百分比
        split.value += (delta / range.value) * 100
      }
    }
    const changedPropetry = computed(() => isHorizontal.value ? 'width' : 'height')
    return {
      split,
      switchLKeyState,
      changeSplitPercent,
      splitContainer,
      changedPropetry,
      isHorizontal,
      dragging
    }
  }
})
</script>
<style lang="scss" scoped>
.split-container {
  display: flex;
  width: 100%;
  height: 100%;
  align-items: stretch;
  justify-content: flex-start;
  &.dragging {
    user-select: none;
  }
  &.vertcial {
    flex-direction: column;
    .split-div .sense-area:hover {
      cursor: ns-resize;
    }
  }
  .split-panel {
    display: inline-block;
    vertical-align: top;
  }
  .split-div {
    position: relative;
    .sense-area {
      // 居中且加大感应区域
      position: absolute;
      width: 100%;
      height: 100%;
      padding: 3px;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      z-index: 100;
      &:hover {
        cursor: ew-resize;
        background-color: rgb(0, 127, 212);
      }
    }
  }
}
</style>
