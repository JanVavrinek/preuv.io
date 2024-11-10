import type { DialogRootProps } from "@kobalte/core/dialog";
import type { SlotProp } from "@utils/styles";
import type { JSX } from "solid-js";
import type { VariantProps } from "tailwind-variants";
import type { dialogStyles } from "./styles";

export type DialogVariants = VariantProps<typeof dialogStyles>;

export type DialogSlots = keyof (typeof dialogStyles)["slots"];

export interface DialogProps extends DialogRootProps, DialogVariants, SlotProp<DialogSlots> {
	/** The children of the element */
	children?: JSX.Element;

	/** Custom classes applied to the element */
	class?: string;

	title?: JSX.Element;
	description?: JSX.Element;
	openTrigger?: JSX.Element;
}
