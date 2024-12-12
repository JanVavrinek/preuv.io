import type { JSX } from "solid-js";
import type { z } from "zod";

export type ComboboxItem<T extends string = string> = {
	label: string;
	icon?: JSX.Element;
	value: T;
	disabled?: boolean;
};

export type ComboboxProps<T, U, V extends string> = {
	options: ComboboxItem<V>[];
	label?: string;
	value?: ComboboxItem<V>;
	onChange: (value: ComboboxItem<V> | null) => void;
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
