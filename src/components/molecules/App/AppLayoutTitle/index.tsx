import { appLayoutTitleContext } from "@contexts/AppLayoutTitle";
import { Title } from "@solidjs/meta";
import { type ParentProps, createEffect, on, useContext } from "solid-js";
import type { AppLayoutTitleProps } from "./types";

export default function AppLayoutTitle(props: ParentProps<AppLayoutTitleProps>) {
	const { setTitle } = useContext(appLayoutTitleContext);

	createEffect(
		on(
			() => props.children,
			(c) => {
				if (c) setTitle("title", String(c));
			},
		),
	);

	createEffect(
		on(
			() => props.label,
			() => setTitle("label", props.label),
		),
	);

	return <Title>{props.children}</Title>;
}
