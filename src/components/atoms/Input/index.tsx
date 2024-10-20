import { TextField } from "@kobalte/core/text-field";
import {
	For,
	Match,
	Show,
	Switch,
	type ValidComponent,
	createMemo,
	createSignal,
	splitProps,
} from "solid-js";

import { Button } from "@kobalte/core/button";
import type { PolymorphicProps } from "@kobalte/core/polymorphic";
import useI18n from "@lib/i18n/hooks/useI18n";
import { FaSolidEye, FaSolidEyeSlash } from "solid-icons/fa";
import { inputStyles } from "./styles";
import type { InputProps } from "./types";

export default function Input<T, U, W extends ValidComponent = "div">(
	props: PolymorphicProps<W, InputProps<T, U, W>>,
) {
	const { c } = useI18n();
	const [local, inputProps, others] = splitProps(
		props as InputProps<T, U>,
		[
			"class",
			"slotClasses",
			"icon",
			"type",
			"label",
			"placeholder",
			"parseResult",
			"description",
			"showErrors",
		],
		["inputProps"],
	);

	const styles = createMemo(() => inputStyles(local));

	const [type, setType] = createSignal<InputProps<T, U>["type"]>(
		local.type ?? "text",
	);

	const parseIssues = createMemo(() =>
		props.parseResult?.success ? undefined : props.parseResult?.error.issues,
	);
	return (
		<TextField
			class={styles().root({
				class: [local.slotClasses?.root, local.class],
			})}
			validationState={
				!!parseIssues()?.length && local.showErrors ? "invalid" : "valid"
			}
			name={inputProps.inputProps?.name}
			{...others}
		>
			<Show when={local.label}>
				<TextField.Label class="pl-2 text-pv-blue-700">
					{local.label}
				</TextField.Label>
			</Show>
			<div class=" focus-within:-translate-y-[5px] relative flex h-14 flex-row items-center rounded-2xl border border-pv-blue-200 bg-pv-blue-100 transition-all duration-300 focus-within:shadow-lg group-data-[invalid]:border-pv-red-400">
				<TextField.Input
					type={type()}
					class="h-full w-full border-none bg-transparent px-2 outline-none"
					placeholder={local.placeholder}
					{...inputProps.inputProps}
				/>

				<Show when={local.type === "password"}>
					<Button
						class="grid h-10 w-10 place-content-center"
						onclick={() => setType(type() === "password" ? "text" : "password")}
					>
						<Switch>
							<Match when={type() === "password"}>
								<FaSolidEyeSlash size={18} />
							</Match>
							<Match when={type() === "text"}>
								<FaSolidEye size={18} />
							</Match>
						</Switch>
					</Button>
				</Show>
			</div>
			<Show when={!!parseIssues()?.length && local.showErrors}>
				<ol class="flex flex-col gap-1 pl-2 text-pv-red-500 text-sm">
					<For each={parseIssues()}>
						{(issue) => (
							<TextField.ErrorMessage as="li">
								{c.errors.zod[issue.code](issue as never)}
							</TextField.ErrorMessage>
						)}
					</For>
				</ol>
			</Show>
		</TextField>
	);
}
