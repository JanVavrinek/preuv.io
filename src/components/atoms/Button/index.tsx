import { Button as KButton } from "@kobalte/core/button";
import { Show, type ValidComponent, createMemo, splitProps } from "solid-js";

import type { PolymorphicProps } from "@kobalte/core/polymorphic";
import { runIfFn } from "@utils/styles";
import { buttonStyles } from "./styles";
import type { ButtonProps } from "./types";

export default function Button<T extends ValidComponent = "button">(props: PolymorphicProps<T, ButtonProps<T>>) {
	const [local, variantProps, others] = splitProps(
		props as ButtonProps,
		["class", "children", "slotClasses", "icon"],
		["variant"],
	);

	const styles = createMemo(() => buttonStyles(variantProps));

	const icon = createMemo(() => {
		return runIfFn(local.icon, variantProps.variant);
	});

	return (
		<KButton
			class={styles().root({
				class: [local.slotClasses?.root, local.class],
			})}
			{...others}
		>
			<span
				aria-hidden="true"
				class={styles().icon({
					class: [local.slotClasses?.icon],
				})}
			>
				<Show when={icon()}>{icon()}</Show>
			</span>
			{local.children}
		</KButton>
	);
}
