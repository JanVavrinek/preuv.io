import InterSectionObserver from "@atoms/IntersectionObserver";
import { Select as KSelect } from "@kobalte/core/select";
import useI18n from "@lib/i18n/hooks/useI18n";
import { FaSolidAngleDown, FaSolidCheck } from "solid-icons/fa";
import { For, Show, type VoidProps, createMemo } from "solid-js";
import { selectStyles } from "./styles";
import styles from "./styles.module.css";
import type { SelectItem, SelectProps } from "./types";

export default function Select<T, U, V extends string>(props: VoidProps<SelectProps<T, U, V>>) {
	const { c } = useI18n();
	const parseIssues = createMemo(() => (props.parseResult?.success ? undefined : props.parseResult?.error.issues));

	return (
		<KSelect<SelectItem<V>>
			options={props.options}
			optionValue="value"
			optionTextValue="label"
			optionDisabled="disabled"
			itemComponent={({ item }) => (
				<KSelect.Item item={item} class={styles.item}>
					<KSelect.ItemLabel class="flex w-full flex-row flex-wrap items-center gap-1">
						{item.rawValue.icon}
						<p class="line-clamp-1">{item.rawValue.label}</p>
					</KSelect.ItemLabel>
					<KSelect.ItemIndicator>
						<p class="text-pv-blue-400">
							<FaSolidCheck />
						</p>
					</KSelect.ItemIndicator>
				</KSelect.Item>
			)}
			class={selectStyles().root({
				class: props.class,
			})}
			value={props.value}
			onChange={props.onChange}
			fitViewport
			modal
			readOnly={props.readOnly}
			validationState={!!parseIssues()?.length && props.showErrors ? "invalid" : "valid"}
		>
			<Show when={props.label}>
				<KSelect.Label class="pl-2 text-pv-blue-700">{props.label}</KSelect.Label>
			</Show>
			<KSelect.HiddenSelect {...props.selectProps} hidden />
			<KSelect.Trigger class="flex w-full rounded-2xl border border-pv-blue-200 bg-pv-blue-100">
				<KSelect.Value<SelectItem> class="flex h-14 w-full items-center gap-2 rounded-l-2xl bg-transparent px-2">
					{(s) => s.selectedOption().label}
				</KSelect.Value>
				<KSelect.Icon class="group grid place-items-center pr-2">
					<FaSolidAngleDown class="transition-all duration-150 group-data-[expanded]:rotate-180 " />
				</KSelect.Icon>
			</KSelect.Trigger>
			<KSelect.Portal>
				<KSelect.Content class={styles.content}>
					<KSelect.Listbox class="m-0 flex h-max flex-col gap-2 " />
					<Show when={props.onReachEnd} keyed>
						{(handler) => <InterSectionObserver onIntersection={handler} />}
					</Show>
				</KSelect.Content>
			</KSelect.Portal>
			<Show when={!!parseIssues()?.length && props.showErrors}>
				<ol class="flex flex-col gap-1 pl-2 text-pv-red-500 text-sm">
					<For each={parseIssues()}>
						{(issue) => <KSelect.ErrorMessage as="li">{c.errors.zod[issue.code](issue as never)}</KSelect.ErrorMessage>}
					</For>
				</ol>
			</Show>
		</KSelect>
	);
}
