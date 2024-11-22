import type { AlertRootProps } from "@kobalte/core/alert";
import type { JSX, ValidComponent } from "solid-js";

import type { SlotProp } from "@utils/styles";
import type { VariantProps } from "tailwind-variants";
import type { alertStyles } from "./styles";

export type AlertVariants = VariantProps<typeof alertStyles>;

export type AlertSlots = keyof (typeof alertStyles)["slots"];

export type AlertStatus = Exclude<AlertVariants["variant"], undefined>;

export interface AlertProps<T extends ValidComponent = "div">
	extends AlertRootProps<T>,
		AlertVariants,
		SlotProp<AlertSlots> {
	/** The icon to show before the alert content. */
	icon?: JSX.Element | ((status?: AlertStatus) => JSX.Element);

	/** The children of the element */
	children?: JSX.Element;

	/** Custom classes applied to the element */
	class?: string;
}
