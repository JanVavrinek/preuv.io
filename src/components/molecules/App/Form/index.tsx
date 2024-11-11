import useI18n from "@lib/i18n/hooks/useI18n";
import { A } from "@solidjs/router";
import type { VoidProps } from "solid-js";
import type { FormProps } from "./types";

export default function Form(props: VoidProps<FormProps>) {
	const { c } = useI18n();
	return (
		<A
			href={`/app/form/${props.form.form.id}`}
			class="flex flex-col gap-2 rounded-xl border border-pv-blue-200 bg-pv-blue-100 p-2"
		>
			<p class="font-semibold text-xl">{props.form.form.name}</p>
			<hr class="border-pv-blue-200" />
			<div class="flex flex-row gap-4">
				<div class="flex flex-col gap-1">
					<p class="text-pv-blue-400 text-sm">{c.app.form.detail.totalVisits()}</p>
					<p class="font-bold text-lg text-pv-blue-500">{props.form.total_visits}</p>
				</div>
				<div class="flex flex-col gap-1">
					<p class="text-pv-blue-400 text-sm">{c.app.form.detail.uniqueVisits()}</p>
					<p class="font-bold text-lg text-pv-blue-500">{props.form.unique_visits}</p>
				</div>
			</div>
		</A>
	);
}
