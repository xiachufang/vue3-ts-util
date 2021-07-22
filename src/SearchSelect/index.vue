<template>
  <a-select
    v-model:value="selected"
    :get-popup-container="trigger => trigger.parentNode"
    placeholder="请选择"
    :mode="mode"
    :filter-option="false"
    @search="onSearch"
    @blur="searchTarget = ''"
    :options="currOptions"
    optionLabelProp="title"
    show-search
  />
</template>

<script lang="ts">
import { customPropType } from '../'
import { computed, defineComponent, ref } from 'vue'
import { defaultConv, useOptionsComputed } from './optionsComputed'

export default defineComponent({
  props: {
    value: customPropType<any>(),
    mode: customPropType((): 'multiple' | undefined => undefined),
    /**
     * 选项数组
     */
    options: customPropType<any[]>(),
    /**
     * 配置如何将选项转换成显示的文本，值，键
     */
    conv: customPropType(() => defaultConv)
  },
  setup (props, ctx) {
    const searchTarget = ref('') // 当前搜索目标
    const selected = computed({
      get: () => props.value,
      set: arg => {
        ctx.emit('update:value', arg)
        searchTarget.value = '' // 选中发生变化时重置
      }
    })
    const onSearch = (target: string) => {
      searchTarget.value = target
    }
    const { currOptions } = useOptionsComputed(props, searchTarget)
    return {
      currOptions,
      onSearch,
      selected,
      searchTarget
    }
  }
})
</script>

<style>
</style>
