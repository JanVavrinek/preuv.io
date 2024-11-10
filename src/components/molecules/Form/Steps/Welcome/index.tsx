import Button from "@atoms/Button";
import useI18n from "@lib/i18n/hooks/useI18n";
import formConfig from "@lib/mdx/form";
import { FaSolidArrowRight } from "solid-icons/fa";
import type { VoidProps } from "solid-js";
import { SolidMarkdown } from "solid-markdown";
import type { WelcomeProps } from "./types";

export default function Welcome(props: VoidProps<WelcomeProps>) {
	const { c } = useI18n();
	return (
		<>
			<h1 class="font-bold text-2xl text-pv-blue-500">{props.project}</h1>
			<SolidMarkdown class="w-full py-4 text-pv-blue-500 " components={formConfig}>
				{props.text}
			</SolidMarkdown>
			<Button icon={<FaSolidArrowRight />} class="w-full" onclick={props.onNext}>
				{c.generic.actions.continue()}
			</Button>
		</>
	);
}
