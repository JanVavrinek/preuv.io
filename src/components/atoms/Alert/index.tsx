import { Alert as KAlert } from "@kobalte/core/alert";
import { Show, type ValidComponent, createMemo, splitProps } from "solid-js";

import type { PolymorphicProps } from "@kobalte/core/polymorphic";
import { runIfFn } from "@utils/styles";
import { FaSolidXmark } from "solid-icons/fa";
import { alertStyles } from "./styles";
import type { AlertProps } from "./types";

export function Alert<T extends ValidComponent = "div">(props: PolymorphicProps<T, AlertProps<T>>) {
	const [local, variantProps, others] = splitProps(
		props as AlertProps,
		["class", "children", "slotClasses", "icon"],
		["variant"],
	);

	const styles = createMemo(() => alertStyles(variantProps));

	const icon = createMemo(() => {
		return runIfFn(local.icon, variantProps.variant);
	});

	return (
		<KAlert
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
				<Show when={icon()} fallback={<FaSolidXmark />}>
					{icon()}
				</Show>
			</span>
			{local.children}
		</KAlert>
	);
}
