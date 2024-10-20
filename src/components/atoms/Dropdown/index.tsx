import { DropdownMenu } from "@kobalte/core/dropdown-menu";
import { A } from "@solidjs/router";
import { FaSolidAngleDown, FaSolidAngleRight } from "solid-icons/fa";
import { For, type ParentProps, Show, createMemo } from "solid-js";
import { dropdownStyles } from "./styles";
import styles from "./styles.module.css";
import type { DropdownProps } from "./types";

export default function Dropdown(props: ParentProps<DropdownProps>) {
	const variantStyles = createMemo(() => dropdownStyles());

	return (
		<DropdownMenu gutter={4}>
			<DropdownMenu.Trigger
				class={variantStyles().trigger({
					class: props.class,
				})}
			>
				<div class="line-clamp-1">{props.children}</div>
				<DropdownMenu.Icon class="text-pv-blue-400 transition-all duration-150 data-[expanded]:rotate-180">
					<FaSolidAngleDown />
				</DropdownMenu.Icon>
			</DropdownMenu.Trigger>
			<DropdownMenu.Portal>
				<DropdownMenu.Content class={styles.content}>
					<For each={props.items}>
						{(item) => (
							<Show
								when={item.items}
								keyed
								fallback={
									<DropdownMenu.Item
										disabled={item.disabled}
										class={styles.item}
										onSelect={item.onSelect}
										as={item.href ? A : undefined}
										href={item.href ?? ""}
									>
										{item.label}
									</DropdownMenu.Item>
								}
							>
								{(subItems) => (
									<DropdownMenu.Sub gutter={4}>
										<DropdownMenu.SubTrigger
											disabled={item.disabled}
											onSelect={item.onSelect}
											class={styles.item}
										>
											{item.label}
											<FaSolidAngleRight />
										</DropdownMenu.SubTrigger>
										<DropdownMenu.Portal>
											<DropdownMenu.SubContent class={styles.content}>
												<For each={subItems}>
													{(subItem) => (
														<DropdownMenu.Item
															onclick={subItem.onSelect}
															disabled={subItem.disabled}
															class={styles.item}
															as={item.href ? A : undefined}
															href={item.href ?? ""}
														>
															{subItem.label}
														</DropdownMenu.Item>
													)}
												</For>
											</DropdownMenu.SubContent>
										</DropdownMenu.Portal>
									</DropdownMenu.Sub>
								)}
							</Show>
						)}
					</For>
				</DropdownMenu.Content>
			</DropdownMenu.Portal>
		</DropdownMenu>
	);
}
