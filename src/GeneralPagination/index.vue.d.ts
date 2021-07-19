declare const _default: import("vue").DefineComponent<{
  option: import('./useAntdListPagination').PaginationOption;
}, {}, unknown, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, Record<string, any>, string, import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps, Readonly<{
  option?: unknown;
} & {
  option: import('./useAntdListPagination').PaginationOption;
} & {}>, {}>;
/**
* @example
* ```tsx
* const { pagination } = useAntdListPagination(cursor => getPagedRecipe({ cursor }), resp => resp.recipes)
* <GeneralPagination option={pagination} />
* ```
*/
export default _default;
