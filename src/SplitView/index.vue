<template>
  <div
    ref="splitContainer"
    class="split-container"
    @mouseup.capture="switchLKeyState(false)"
    @mousemove="changeSplitPercent"
    @mouseleave="switchLKeyState(false)"
  >
    <div
      :class="{'split-panel':true,'transparent-border':!border}"
      :style="`width:calc(${split.per}% - 8px)`"
    >
      <slot name="left" />
    </div>
    <div class="split-div">
      <div class="sense-area" @mousedown="switchLKeyState(true)" />
    </div>
    <div
      :class="{'split-panel':true,'transparent-border':!border}"
      :style="`width:calc(${100-split.per}% - 8px)`"
    >
      <slot name="right" />
    </div>
  </div>
</template>
<script lang="ts">
import { customPropType, deepComputed, useDomRect } from '../'
import { defineComponent, ref, computed } from 'vue'

export default defineComponent({
  props: {
    percent: customPropType(() => 50),
    border: customPropType(() => false),
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
    const split = deepComputed({
      get: () => ({ per: props.percent }),
      set: (v) => ctx.emit('update:percent', v.per)
    })
    let lKeyIsDown = false
    const switchLKeyState = (isDown: boolean) => {
      lKeyIsDown = isDown
    }
    const changeSplitPercent = (event: MouseEvent) => {
      if (lKeyIsDown) {
        const delta = isHorizontal.value ? event.movementX : event.movementY
        // 鼠标移动的像素转换成改变的百分比
        split.value.per += (delta / range.value) * 100
      }
    }
    return {
      split,
      switchLKeyState,
      changeSplitPercent,
      splitContainer
    }
  }
})
</script>
<style lang="scss" scoped>
.split-container {
  display: flex;
  width: calc(100% - 8px);
  margin: 4px;
  align-items: stretch;
  justify-content: flex-start;
  user-select: none;
  &.vertcial {
    flex-direction: column;
  }
  .split-panel {
    display: inline-block;
    vertical-align: top;
    border: solid 1px lightgray;
    border-radius: 4px;
  }
  .transparent-border {
    border: solid 1px transparent;
  }
  .split-div {
    padding: 2px;
    position: relative;
    .sense-area {
      // 居中且加大感应区域
      position: absolute;
      range: 100%;
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
