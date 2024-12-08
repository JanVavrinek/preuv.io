import useI18n from "@lib/i18n/hooks/useI18n";
import formConfig from "@lib/mdx/form";
import type { VoidProps } from "solid-js";
import { SolidMarkdown } from "solid-markdown";
import type { ThankYouProps } from "./types";

export default function ThankYou(props: VoidProps<ThankYouProps>) {
	const { c } = useI18n();
	return (
		<>
			<h1 class="font-bold text-2xl text-pv-blue-500">{c.form.thankyou.title()}</h1>
			<SolidMarkdown class="w-full py-4 text-pv-blue-500 " components={formConfig}>
				{props.text}
			</SolidMarkdown>
		</>
	);
}
