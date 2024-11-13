import { For, type VoidProps } from "solid-js";
import type { CommentsWidgetProps } from "./types";

export default function CommentsWidget(props: VoidProps<CommentsWidgetProps>) {
	return (
		<div class="h-full w-full">
			<For each={props.testimonials}>{(t) => <p style={{ color: props.options.accent }}>{t.testimonial.text}</p>}</For>
		</div>
	);
}
