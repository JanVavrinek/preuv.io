import { TextField } from "@kobalte/core/text-field";
import { For, Match, Show, Switch, type ValidComponent, createMemo, createSignal, splitProps } from "solid-js";

import { Button } from "@kobalte/core/button";
import type { PolymorphicProps } from "@kobalte/core/polymorphic";
import useI18n from "@lib/i18n/hooks/useI18n";
import { FaSolidEye, FaSolidEyeSlash } from "solid-icons/fa";
import { inputStyles } from "./styles";
import type { InputProps } from "./types";

export default function Input<T, U, W extends ValidComponent = "div">(props: PolymorphicProps<W, InputProps<T, U, W>>) {
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
			"textArea",
			"textAreaProps",
			"minLength",
			"maxLength",
		],
		["inputProps"],
	);

	const styles = createMemo(() => inputStyles(local));

	const [type, setType] = createSignal<InputProps<T, U>["type"]>(local.type ?? "text");

	const parseIssues = createMemo(() => (props.parseResult?.success ? undefined : props.parseResult?.error.issues));
	return (
		<TextField
			class={styles().root({
				class: [local.slotClasses?.root, local.class],
			})}
			validationState={!!parseIssues()?.length && local.showErrors ? "invalid" : "valid"}
			name={inputProps.inputProps?.name}
			{...others}
		>
			<Show when={local.label}>
				<TextField.Label class="pl-2 text-pv-blue-700 transition-all group-focus-within:translate-y-1">
					{local.label}
				</TextField.Label>
			</Show>
			<div
				class={styles().wrapper({
					class: [local.slotClasses?.wrapper],
				})}
			>
				<Show
					when={local.textArea}
					fallback={
						<div class="relative h-max w-full">
							<TextField.Input
								type={type()}
								class="peer h-14 w-full border-none bg-transparent px-4 outline-none"
								placeholder={local.placeholder}
								{...inputProps.inputProps}
							/>
							<Show when={local.placeholder}>
								<div class="pointer-events-none absolute inset-0 flex h-full w-0 max-w-max items-center overflow-hidden transition-all duration-300 peer-placeholder-shown:w-96 peer-focus-within:w-0">
									<p class="text-nowrap px-3">
										<span class="rounded-md bg-pv-blue-200/40 p-1 text-pv-blue-400">{local.placeholder}</span>
									</p>
								</div>
							</Show>
						</div>
					}
				>
					<TextField.TextArea
						type={type()}
						class="h-full min-h-14 w-full border-none bg-transparent p-2 outline-none"
						placeholder={local.placeholder}
						{...local.textAreaProps}
						{...inputProps.inputProps}
					/>
				</Show>

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
			<Show when={local.maxLength}>
				<p class="text-right text-pv-blue-400 text-xs">
					<span
						classList={{
							"text-pv-red-500 font-bold":
								(others.value?.length ?? 0) > (local.maxLength ?? 0) ||
								(others.value?.length ?? 0) < (local.minLength ?? 0),
						}}
					>
						{others.value?.length}
					</span>
					/{local.maxLength}
				</p>
			</Show>
			<ol class="flex flex-col gap-1 pl-2 text-pv-red-500 text-sm">
				<Show when={!!parseIssues()?.length && local.showErrors}>
					<For each={parseIssues()}>
						{(issue) => (
							<TextField.ErrorMessage as="li">{c.errors.zod[issue.code](issue as never)}</TextField.ErrorMessage>
						)}
					</For>
				</Show>
			</ol>
		</TextField>
	);
}
