import { For, type VoidProps } from "solid-js";
import type { SimpleWidgetProps } from "./types";

export default function SimpleWidget(props: VoidProps<SimpleWidgetProps>) {
	return (
		<div class="h-full w-full">
			<For each={props.testimonials}>{(t) => <p style={{ color: props.options.accent }}>{t.testimonial.text}</p>}</For>
		</div>
	);
}
