declare const _default: import("vue").DefineComponent<{
    value: {
        type: import("vue").PropType<any>;
        required: true;
    };
    mode: {
        type: import("vue").PropType<"multiple" | undefined>;
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
        type: import("vue").PropType<{
            key: typeof import("ramda").identity;
            value: typeof import("ramda").identity;
            optionText: typeof import("ramda").identity;
            text: typeof import("ramda").identity;
        }>;
        required: true;
    };
}, {
    currOptions: import("vue").ComputedRef<any>;
    onSearch: (target: string) => void;
    selected: import("vue").WritableComputedRef<unknown>;
    searchTarget: import("vue").Ref<string>;
}, unknown, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, Record<string, any>, string, import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps, Readonly<{
    value?: unknown;
    mode?: unknown;
    options?: unknown;
    conv?: unknown;
} & {
    value: unknown;
    mode: "multiple" | undefined;
    options: any[];
    conv: {
        key: typeof import("ramda").identity;
        value: typeof import("ramda").identity;
        optionText: typeof import("ramda").identity;
        text: typeof import("ramda").identity;
    };
} & {}>, {}>;
export default _default;
