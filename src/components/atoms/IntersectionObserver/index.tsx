import { type ParentProps, onMount } from "solid-js";
import type { IntersectionObserverProps } from "./types";

export default function InterSectionObserver(props: ParentProps<IntersectionObserverProps>) {
	let observed: HTMLDivElement | undefined;
	let observer: HTMLDivElement | undefined;

	const handleIntersection = (entries: IntersectionObserverEntry[]) => {
		for (const entry of entries) if (entry.isIntersecting) props.onIntersection();
	};

	onMount(() => {
		const intersectionObserver = new IntersectionObserver(handleIntersection, {
			root: observer,
			threshold: props.threshold ?? 0.1,
			rootMargin: props.rootMargin ?? "150px 0px 0px 0px",
		});
		if (observed) intersectionObserver.observe(observed);
	});

	return (
		<div ref={observer} class={props.class ?? "w-full"}>
			{props.children}
			<div ref={observed} class="h-0 w-full" />
		</div>
	);
}
