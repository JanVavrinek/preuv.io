import type { CollapsibleRootProps } from "@kobalte/core/collapsible";
import type { JSX, ValidComponent } from "solid-js";

export interface CollapsibleProps<T extends ValidComponent = "div"> extends CollapsibleRootProps<T> {
	/** The children of the element */
	children?: JSX.Element;

	/** Custom classes applied to the element */
	class?: string;

	/** The children of the trigger element */
	triggerChildren: JSX.Element;
}
