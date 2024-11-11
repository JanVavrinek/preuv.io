import type { ComponentProps } from "solid-js";
import type { SolidMarkdown } from "solid-markdown";

export type MarkdownEditorProps = {
	value: string;
	onChange: (value: string) => void;
	markdownComponents?: ComponentProps<typeof SolidMarkdown>["components"];
	class?: string;
};
