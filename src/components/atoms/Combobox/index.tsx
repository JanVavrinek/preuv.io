import InterSectionObserver from "@atoms/IntersectionObserver";
import { Combobox as KCombobox } from "@kobalte/core/combobox";
import { FaSolidAngleDown } from "solid-icons/fa";
import { Show, type VoidProps } from "solid-js";
import styles from "./styles.module.css";
import type { ComboboxItem, ComboboxProps } from "./types";

export default function Combobox(props: VoidProps<ComboboxProps>) {
	return (
		<KCombobox<ComboboxItem>
			options={props.options}
			optionValue="value"
			optionTextValue="label"
			optionLabel="label"
			optionDisabled="disabled"
			itemComponent={({ item }) => (
				<KCombobox.Item item={item} class={styles.item}>
					<KCombobox.ItemLabel class="flex flex-row flex-wrap items-center gap-1">
						{item.rawValue.icon}
						<p class="line-clamp-1">{item.rawValue.label}</p>
					</KCombobox.ItemLabel>
				</KCombobox.Item>
			)}
			class="flex flex-col gap-1"
			value={props.value}
			onChange={props.onChange}
			fitViewport
			preventScroll
			onInputChange={props.onInputChange}
		>
			<Show when={props.label}>
				<KCombobox.Label class="pl-2 text-pv-blue-700">{props.label}</KCombobox.Label>
			</Show>
			<KCombobox.HiddenSelect {...props.selectProps} hidden />
			<KCombobox.Control class="flex w-full rounded-2xl border border-pv-blue-200 bg-pv-blue-100">
				<KCombobox.Input class="h-14 w-full rounded-l-2xl bg-transparent px-2" />
				<KCombobox.Trigger class="px-2 transition-all duration-150 data-[expanded]:rotate-180">
					<KCombobox.Icon>
						<FaSolidAngleDown />
					</KCombobox.Icon>
				</KCombobox.Trigger>
			</KCombobox.Control>
			<KCombobox.Portal>
				<KCombobox.Content class={styles.content}>
					<KCombobox.Listbox class="m-0 flex h-max flex-col gap-2 " />
					<Show when={props.onReachEnd} keyed>
						{(handler) => <InterSectionObserver onIntersection={handler} />}
					</Show>
				</KCombobox.Content>
			</KCombobox.Portal>
		</KCombobox>
	);
}
