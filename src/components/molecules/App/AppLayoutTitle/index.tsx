import { appLayoutTitleContext } from "@contexts/AppLayoutTitle";
import { Title } from "@solidjs/meta";
import { type ParentProps, createEffect, on, useContext } from "solid-js";

export default function AppLayoutTitle(props: ParentProps) {
	const { setTitle } = useContext(appLayoutTitleContext);

	createEffect(
		on(
			() => props.children,
			(c) => {
				if (c) setTitle(String(c));
			},
		),
	);

	return <Title>{props.children}</Title>;
}
