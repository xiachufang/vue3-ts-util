<template>
  <a-select
    :value="asNullValues.includes(selected) ? null : selected"
    @update:value="v => selected = v"
    :get-popup-container="trigger => trigger.parentNode"
    placeholder="请选择"
    :filter-option="false"
    @search="onSearch"
    :options="currOptions"
    optionLabelProp="title"
    show-search
    :mode="mode"
    v-bind="$attrs"
  />
</template>

<script lang="ts">
import { customPropType } from '../'
import { computed, defineComponent, ref } from 'vue'
import { Props, useOptionsComputed } from '.'
import { SearchSelectConv } from './typedef'
import { Select as ASelect }  from 'ant-design-vue'

export default defineComponent({
  components: {
    ASelect
  },
  emits: ['update:value'],
  props: {
    value: customPropType<any>(),
    /**
     * 选项数组
     */
    options: customPropType<any[]>(),
    /**
     * 配置如何将选项转换成显示的文本，值，键
     */
    conv: customPropType<SearchSelectConv<any>>(),
    /**
     * 需要多选加上这个
     */
    mode: customPropType<'multiple'>(false),
    /**
     * 可以看做是空值的列表, 默认0和空字符串，即传入0和空字符串时会把他当成是null来对待，而显示placeholder。
     * 详细见对应文档部分
     */
    asNullValues: customPropType(() => [0, ''] as any[])
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
    const { currOptions } = useOptionsComputed(props as Props, searchTarget)
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
