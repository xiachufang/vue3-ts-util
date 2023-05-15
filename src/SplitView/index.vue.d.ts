declare const _default: import("vue").DefineComponent<{
    percent: {
        default: number;
    };
    direction: {
        default: "vertical" | "horizontal";
    };
}, {
    split: import("vue").Ref<number>;
    switchLKeyState: (isDown: boolean) => void;
    changeSplitPercent: (event: MouseEvent) => void;
    splitContainer: import("vue").Ref<HTMLDivElement | undefined>;
    changedPropetry: import("vue").ComputedRef<"width" | "height">;
    isHorizontal: import("vue").ComputedRef<boolean>;
    dragging: import("vue").Ref<boolean>;
}, unknown, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, Record<string, any>, string, import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps, Readonly<{
    percent?: unknown;
    direction?: unknown;
} & {
    percent: number;
    direction: "vertical" | "horizontal";
} & {}>, {
    percent: number;
    direction: "vertical" | "horizontal";
}>;
export default _default;
