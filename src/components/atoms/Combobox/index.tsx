import InterSectionObserver from "@atoms/IntersectionObserver";
import { Combobox as KCombobox } from "@kobalte/core/combobox";
import useI18n from "@lib/i18n/hooks/useI18n";
import { FaSolidAngleDown, FaSolidCheck } from "solid-icons/fa";
import { For, Show, type VoidProps, createMemo } from "solid-js";
import { comboBoxStyles } from "./styles";
import styles from "./styles.module.css";
import type { ComboboxItem, ComboboxProps } from "./types";

export default function Combobox<T, U>(props: VoidProps<ComboboxProps<T, U>>) {
	const { c } = useI18n();
	const parseIssues = createMemo(() => (props.parseResult?.success ? undefined : props.parseResult?.error.issues));

	return (
		<KCombobox<ComboboxItem>
			options={props.options}
			optionValue="value"
			optionTextValue="label"
			optionLabel="label"
			optionDisabled="disabled"
			itemComponent={({ item }) => (
				<KCombobox.Item item={item} class={styles.item}>
					<KCombobox.ItemLabel class="flex w-full flex-row flex-wrap items-center gap-1">
						{item.rawValue.icon}
						<p class="line-clamp-1">{item.rawValue.label}</p>
					</KCombobox.ItemLabel>
					<KCombobox.ItemIndicator>
						<p class="text-pv-blue-400">
							<FaSolidCheck />
						</p>
					</KCombobox.ItemIndicator>
				</KCombobox.Item>
			)}
			class={comboBoxStyles().root({
				class: props.class,
			})}
			value={props.value}
			onChange={props.onChange}
			fitViewport
			modal
			onInputChange={props.onInputChange}
			readOnly={props.readOnly}
			validationState={!!parseIssues()?.length && props.showErrors ? "invalid" : "valid"}
			triggerMode="focus"
		>
			<Show when={props.label}>
				<KCombobox.Label class="pl-2 text-pv-blue-700">{props.label}</KCombobox.Label>
			</Show>
			<KCombobox.HiddenSelect {...props.selectProps} hidden />
			<KCombobox.Control class="flex w-full rounded-2xl border border-pv-blue-200 bg-pv-blue-100">
				<KCombobox.Input class="h-14 w-full rounded-l-2xl bg-transparent px-2" />
				<KCombobox.Trigger class="rounded-r-2xl px-2 transition-all duration-150 hover:bg-pv-blue-200">
					<KCombobox.Icon class="block transition-all duration-150 data-[expanded]:rotate-180">
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
			<Show when={!!parseIssues()?.length && props.showErrors}>
				<ol class="flex flex-col gap-1 pl-2 text-pv-red-500 text-sm">
					<For each={parseIssues()} fallback="dasda">
						{(issue) => (
							<KCombobox.ErrorMessage as="li">{c.errors.zod[issue.code](issue as never)}</KCombobox.ErrorMessage>
						)}
					</For>
				</ol>
			</Show>
		</KCombobox>
	);
}
