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
        default: SearchSelectConv<any>;
    };
    /**
     * 需要多选加上这个
     */
    mode: {
        type: import("vue").PropType<"multiple">;
    };
    /**
     * 可以看做是空值的列表, 默认0和空字符串，即传入0和空字符串时会把他当成是null来对待，而显示placeholder。
     * 详细见对应文档部分
     */
    asNullValues: {
        default: any[];
    };
}, {
    currOptions: import("vue").ComputedRef<any>;
    onSearch: (target: string) => void;
    selected: import("vue").WritableComputedRef<unknown>;
    searchTarget: import("vue").Ref<string>;
}, unknown, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, "update:value"[], "update:value", import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps, Readonly<{
    value?: unknown;
    options?: unknown;
    conv?: unknown;
    mode?: unknown;
    asNullValues?: unknown;
} & {
    value: unknown;
    options: any[];
    conv: SearchSelectConv<any>;
    asNullValues: any[];
} & {
    mode?: "multiple" | undefined;
}>, {
    conv: SearchSelectConv<any>;
    asNullValues: any[];
}>;
export default _default;
