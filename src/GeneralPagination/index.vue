<template>
  <a-pagination @change="option.onChange" :total="option.total" :current="option.curr" @update:current="option.setCurr" :page-size="option.pageSize"/>
</template>
<script lang="ts">
import { customPropType, useAntdListPagination } from '..'
import { defineComponent } from 'vue'

/**
 * @example
 * ```tsx
 * const { pagination } = useAntdListPagination(cursor => getPagedRecipe({ cursor }), resp => resp.recipes)
 * <GeneralPagination option={pagination} />
 * ```
 */
export default defineComponent({
  props: {
    option: customPropType<ReturnType<typeof useAntdListPagination>['pagination']>()
  },
  setup () {
    return {
    }
  }
})
</script>
