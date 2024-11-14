import { FiExternalLink } from "solid-icons/fi";
import type { ComponentProps } from "solid-js";
import type { SolidMarkdown } from "solid-markdown";

const formConfig: ComponentProps<typeof SolidMarkdown>["components"] = {
	h1: (e) => (
		<div class="py-1">
			<h1 {...e} class="text-2xl" />
			<hr />
		</div>
	),
	h2: (e) => (
		<div class="py-1">
			<h2 {...e} class="text-xl" />
			<hr />
		</div>
	),
	h3: (e) => (
		<div class="py-1">
			<h3 {...e} class="text-lg" />
			<hr />
		</div>
	),
	h4: (e) => (
		<div class="py-1">
			<h4 {...e} />
			<hr />
		</div>
	),
	h5: (e) => (
		<div class="py-1">
			<h5 {...e} />
			<hr />
		</div>
	),
	h6: (e) => (
		<div class="py-1">
			<h6 {...e} />
			<hr />
		</div>
	),
	ul: (e) => <ul {...e} class="list-disc py-1 pl-6" />,
	a: (e) => (
		<span class="inline-flex items-center gap-2 text-pv-navy-400 underline">
			<a {...e} target="_blank" rel="noreferrer" />
			<FiExternalLink />
		</span>
	),
	img: (e) => <img {...e} class="my-1 rounded-2xl" alt={e.alt} />,
	// p: (e) => <p {...e} class="px-1 py-px" />,
};
export default formConfig;
