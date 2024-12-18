import type { JSX } from "solid-js";
import type { z } from "zod";

export type SelectItem<T extends string = string> = {
	label: string;
	icon?: JSX.Element;
	value: T;
	disabled?: boolean;
};

export type SelectProps<T, U, V extends string> = {
	options: SelectItem<V>[];
	label?: string;
	value?: SelectItem<V>;
	onChange: (value: SelectItem<V> | null) => void;
	onInputChange?: (value: string) => void;
	selectProps?: {
		name?: string;
		ref: (element: HTMLSelectElement) => void;
		onInput: JSX.EventHandler<HTMLSelectElement, InputEvent>;
		onChange: JSX.EventHandler<HTMLSelectElement, Event>;
		onBlur: JSX.EventHandler<HTMLSelectElement, FocusEvent>;
	};
	onReachEnd?: () => void;
	parseResult?: z.SafeParseReturnType<T, U>;
	showErrors?: boolean;
	class?: string;
	readOnly?: boolean;
};
