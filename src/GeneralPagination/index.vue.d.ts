declare const _default: import("vue").DefineComponent<{
    option: {
        type: import("vue").PropType<import("..").DeepReadonly<{
            onChange: (page: number) => Promise<void>;
            total: number;
            pageSize: number;
            curr: number;
            setCurr: (v: number) => void;
        }>>;
        required: true;
    };
}, {}, unknown, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps, Readonly<import("vue").ExtractPropTypes<{
    option: {
        type: import("vue").PropType<import("..").DeepReadonly<{
            onChange: (page: number) => Promise<void>;
            total: number;
            pageSize: number;
            curr: number;
            setCurr: (v: number) => void;
        }>>;
        required: true;
    };
}>>, {}>;
/**
 * @example
 * ```tsx
 * const { pagination } = useAntdListPagination(cursor => getPagedRecipe({ cursor }), resp => resp.recipes)
 * <GeneralPagination option={pagination} />
 * ```
 */
export default _default;
