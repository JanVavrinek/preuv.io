import type { JSX } from "solid-js";

export type ComboboxItem = {
	label: string;
	icon?: JSX.Element;
	value: string;
	disabled?: boolean;
};

export type ComboboxProps = {
	options: ComboboxItem[];
	label?: string;
	value?: ComboboxItem;
	onChange: (value: ComboboxItem | null) => void;
	onInputChange?: (value: string) => void;
	selectProps?: {
		name?: string;
		ref: (element: HTMLSelectElement) => void;
		onInput: JSX.EventHandler<HTMLSelectElement, InputEvent>;
		onChange: JSX.EventHandler<HTMLSelectElement, Event>;
		onBlur: JSX.EventHandler<HTMLSelectElement, FocusEvent>;
	};
	onReachEnd?: () => void;
};
