import type { ButtonRootProps } from "@kobalte/core/button";
import type { JSX, ValidComponent } from "solid-js";
import type { VariantProps } from "tailwind-variants";
import type { buttonStyles } from "./styles";
import type { SlotProp } from "@utils/styles";

export type ButtonVariants = VariantProps<typeof buttonStyles>;

export type ButtonSlots = keyof (typeof buttonStyles)["slots"];

export interface ButtonProps<T extends ValidComponent = "button">
	extends ButtonRootProps<T>,
		ButtonVariants,
		SlotProp<ButtonSlots> {
	/** The icon to show before the button content. */
	icon?: JSX.Element | ((variant: ButtonVariants["variant"]) => JSX.Element);

	/** The children of the element */
	children?: JSX.Element;

	/** Custom classes applied to the element */
	class?: string;
}
