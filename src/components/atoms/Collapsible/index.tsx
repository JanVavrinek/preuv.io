import { Collapsible as KCollapsible } from "@kobalte/core/collapsible";
import type { PolymorphicProps } from "@kobalte/core/polymorphic";
import { FaSolidAngleDown } from "solid-icons/fa";
import { Show, type ValidComponent, splitProps } from "solid-js";
import styles from "./styles.module.css";
import type { CollapsibleProps } from "./types";
export default function Collapsible<T extends ValidComponent = "div">(props: PolymorphicProps<T, CollapsibleProps<T>>) {
	const [local, others] = splitProps(props as CollapsibleProps, ["class", "children", "triggerChildren"]);

	const triggerTitleSub = () =>
		Array.isArray(props.triggerChildren) && props.triggerChildren.length === 2 ? props.triggerChildren : undefined;

	return (
		<KCollapsible class="border-pv-blue-200 border-b " {...others}>
			<KCollapsible.Trigger class="group flex w-full flex-row flex-wrap items-center justify-between gap-2 py-3">
				<Show
					when={typeof props.triggerChildren === "string"}
					fallback={
						<Show when={triggerTitleSub()} keyed fallback={local.triggerChildren}>
							{(t) => (
								<div class="flex flex-col items-start text-start">
									<p class="text-pv-blue-500 text-xl">{t[0]}</p>
									<p class="text-pv-blue-400 text-sm">{t[1]}</p>
								</div>
							)}
						</Show>
					}
				>
					<p class="text-pv-blue-500 text-xl">{local.triggerChildren}</p>
				</Show>
				<span class="text-pv-blue-400 transition-all duration-150 group-data-[expanded]:rotate-180">
					<FaSolidAngleDown />
				</span>
			</KCollapsible.Trigger>
			<KCollapsible.Content class={styles.content}>
				<div class="pb-3">{local.children}</div>
			</KCollapsible.Content>
		</KCollapsible>
	);
}
