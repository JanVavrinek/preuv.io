import getRandomInt from "@utils/random";
import { type VoidProps, createMemo } from "solid-js";
import { imageFallbackStyles } from "./styles";
import type { ImageFallbackProps } from "./types";

const COLOR = [
	"#00bca6",
	"#00bc54",
	"#28bc00",
	"#b0bc00",
	"#bc6700",
	"#007dbc",
	"#0032bc",
	"#9000bc",
	"#bc0077",
] as const;

export default function ImageFallback(props: VoidProps<ImageFallbackProps>) {
	const initials = createMemo(() => {
		return props.text
			.split(" ")
			.slice(0, props.maxTextLength ?? 6)
			.reduce((p, c) => p + (c.at(0) ?? ""), "");
	});

	const color = createMemo(() => {
		return COLOR[getRandomInt(0, COLOR.length - 1, initials())];
	});

	return (
		<div
			class={imageFallbackStyles().root({ class: [props.class, props.slotClasses?.root] })}
			style={{ "--random-color": color() }}
		>
			<p class={imageFallbackStyles().text({ class: [props.slotClasses?.text] })}>{initials()}</p>
		</div>
	);
}
