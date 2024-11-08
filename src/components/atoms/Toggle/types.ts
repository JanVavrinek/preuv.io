import type { SwitchRootProps } from "@kobalte/core/switch";
import type { JSX } from "solid-js";

export type ToggleProps = SwitchRootProps & {
	label?: string;
	inputProps?: {
		name?: string;
		ref: (element: HTMLInputElement | HTMLTextAreaElement) => void;
		onInput: JSX.EventHandler<HTMLInputElement | HTMLTextAreaElement, InputEvent>;
		onChange: JSX.EventHandler<HTMLInputElement | HTMLTextAreaElement, Event>;
		onBlur: JSX.EventHandler<HTMLInputElement | HTMLTextAreaElement, FocusEvent>;
	};
};
