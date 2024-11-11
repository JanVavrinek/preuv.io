import EasyMDE from "easymde";
import { Show, type VoidProps, createEffect, createSignal, on } from "solid-js";
import "easymde/dist/easymde.min.css";
import { Tabs } from "@kobalte/core/tabs";
import useI18n from "@lib/i18n/hooks/useI18n";
import { SolidMarkdown } from "solid-markdown";
import type { MarkdownEditorProps } from "./types";

export default function MarkdownEditor(props: VoidProps<MarkdownEditorProps>) {
	const { c } = useI18n();
	let wrapper: HTMLTextAreaElement | undefined;
	const [preview, setPreview] = createSignal<string>("editor");
	const [editor, setEditor] = createSignal<EasyMDE>();

	createEffect(
		on(
			() => wrapper,
			() => {
				if (!wrapper) return;

				const e = new EasyMDE({
					element: wrapper,
					hideIcons: ["preview", "fullscreen", "side-by-side"],
				});
				setEditor(e);
				e.codemirror.on("change", () => props.onChange(e.value()));
			},
		),
	);
	return (
		<div class="flex w-full flex-col gap-2">
			<div>
				<Tabs onChange={setPreview}>
					<Tabs.List class="relative flex gap-2 text-pv-blue-500">
						<Tabs.Trigger value="editor" class="p-2 data-[selected]:font-bold">
							{c.generic.mdEditor.editor()}
						</Tabs.Trigger>
						<Tabs.Trigger value="preview" class="p-2 data-[selected]:font-bold">
							{c.generic.mdEditor.preview()}
						</Tabs.Trigger>
						<Tabs.Indicator class="pointer-events-none absolute top-full left-0 h-1 w-full rounded-full bg-pv-blue-300 px-2 transition-all duration-150" />
					</Tabs.List>
				</Tabs>
			</div>
			<div
				classList={{
					hidden: preview() === "preview",
				}}
			>
				<textarea ref={wrapper} value={props.value} />
			</div>
			<Show when={preview() === "preview"}>
				<SolidMarkdown components={props.markdownComponents} class={props.class}>
					{editor()?.value()}
				</SolidMarkdown>
			</Show>
		</div>
	);
}
