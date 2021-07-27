declare const _default: import("vue").DefineComponent<{
    percent: {
        type: import("vue").PropType<number>;
        required: true;
    };
    border: {
        type: import("vue").PropType<boolean>;
        required: true;
    };
    direction: {
        type: import("vue").PropType<"vertical" | "horizontal">;
        required: true;
    };
}, {
    split: Readonly<import("vue").Ref<{
        per: number;
    }>>;
    switchLKeyState: (isDown: boolean) => void;
    changeSplitPercent: (event: MouseEvent) => void;
    splitContainer: import("vue").Ref<HTMLDivElement | undefined>;
}, unknown, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, Record<string, any>, string, import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps, Readonly<{
    percent?: unknown;
    border?: unknown;
    direction?: unknown;
} & {
    percent: number;
    border: boolean;
    direction: "vertical" | "horizontal";
} & {}>, {}>;
export default _default;
