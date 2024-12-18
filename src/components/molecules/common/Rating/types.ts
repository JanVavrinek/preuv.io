import type { JSX } from "solid-js";

export type RatingProps = {
	value: number;
	onValue?: (value: number) => void;
	readonly?: boolean;
	inputProps?: {
		name?: string;
		ref: (element: HTMLInputElement | HTMLTextAreaElement) => void;
		onInput: JSX.EventHandler<HTMLInputElement | HTMLTextAreaElement, InputEvent>;
		onChange: JSX.EventHandler<HTMLInputElement | HTMLTextAreaElement, Event>;
		onBlur: JSX.EventHandler<HTMLInputElement | HTMLTextAreaElement, FocusEvent>;
	};
	fontSize?: JSX.PresentationSVGAttributes["font-size"];
};
