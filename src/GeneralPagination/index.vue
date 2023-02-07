<template>
  <a-pagination @change="option.onChange" :total="option.total" :current="option.curr" @update:current="option.setCurr"
    :page-size="option.pageSize" />
</template>
<script lang="ts">
import { customPropType, PaginationOption } from '..'
import { defineComponent } from 'vue'
import { Pagination as APagination } from 'ant-design-vue'

/**
 * @example
 * ```tsx
 * const { pagination } = useAntdListPagination(cursor => getPagedRecipe({ cursor }), resp => resp.recipes)
 * <GeneralPagination option={pagination} />
 * ```
 */
export default defineComponent({
  components: {
    APagination
  },
  props: {
    option: customPropType<PaginationOption>()
  },
  setup () {
    return {
    }
  }
})
</script>
