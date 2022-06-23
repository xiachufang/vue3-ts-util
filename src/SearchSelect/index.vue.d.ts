import { SearchSelectConv } from './typedef';
declare const _default: import("vue").DefineComponent<{
    value: {
        type: import("vue").PropType<any>;
        required: true;
    };
    /**
     * 选项数组
     */
    options: {
        type: import("vue").PropType<any[]>;
        required: true;
    };
    /**
     * 配置如何将选项转换成显示的文本，值，键
     */
    conv: {
        type: import("vue").PropType<SearchSelectConv<any>>;
        required: true;
    };
    /**
     * 需要多选加上这个
     */
    mode: {
        type: import("vue").PropType<"multiple">;
    };
}, {
    currOptions: import("vue").ComputedRef<any>;
    onSearch: (target: string) => void;
    selected: import("vue").WritableComputedRef<unknown>;
    searchTarget: import("vue").Ref<string>;
}, unknown, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, Record<string, any>, string, import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps, Readonly<{
    value?: unknown;
    options?: unknown;
    conv?: unknown;
    mode?: unknown;
} & {
    value: unknown;
    options: any[];
    conv: SearchSelectConv<any>;
} & {
    mode?: "multiple" | undefined;
}>, {}>;
export default _default;
