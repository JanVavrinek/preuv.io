import type { TextFieldRootProps, TextFieldTextAreaProps } from "@kobalte/core/text-field";
import type { JSX, ValidComponent } from "solid-js";

import type { SlotProp } from "@utils/styles";
import type { VariantProps } from "tailwind-variants";
import type { z } from "zod";
import type { inputStyles } from "./styles";

export type InputVariants = VariantProps<typeof inputStyles>;

export type InputSlots = keyof (typeof inputStyles)["slots"];

export interface InputProps<T, U, W extends ValidComponent = "div">
	extends TextFieldRootProps<W>,
		InputVariants,
		SlotProp<InputSlots> {
	icon?: JSX.Element;
	class?: string;
	parseResult?: z.SafeParseReturnType<T, U>;
	type?: "text" | "email" | "tel" | "password" | "url" | "number" | "date" | string;
	placeholder?: string;
	label?: JSX.Element;
	description?: JSX.Element;
	showErrors?: boolean;
	maxLength?: number;
	minLength?: number;
	inputProps?: {
		name?: string;
		ref: (element: HTMLInputElement | HTMLTextAreaElement) => void;
		onInput: JSX.EventHandler<HTMLInputElement | HTMLTextAreaElement, InputEvent>;
		onChange: JSX.EventHandler<HTMLInputElement | HTMLTextAreaElement, Event>;
		onBlur: JSX.EventHandler<HTMLInputElement | HTMLTextAreaElement, FocusEvent>;
	};
	textArea?: boolean;
	textAreaProps?: Partial<TextFieldTextAreaProps<"textarea"> & HTMLTextAreaElement>;
}
