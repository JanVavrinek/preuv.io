import Button from "@atoms/Button";
import Skeleton from "@atoms/Skeleton";
import Toggle from "@atoms/Toggle";
import useI18n from "@lib/i18n/hooks/useI18n";
import { A } from "@solidjs/router";
import { FaSolidShare } from "solid-icons/fa";
import { FiExternalLink } from "solid-icons/fi";

export default function FormSkeleton() {
	const { c } = useI18n();

	return (
		<div class="flex flex-col gap-2 rounded-xl border border-pv-blue-200 bg-pv-blue-100 p-2">
			<div class="flex items-center justify-between gap-2">
				<div class="flex flex-col">
					<Skeleton radius={15}>
						<p class="font-semibold text-xl">Form name placeholder</p>
					</Skeleton>
					<Skeleton radius={15} class="!w-max mt-1">
						<A class="flex items-center gap-2 text-pv-navy-500" href="#">
							project placeholder
							<FiExternalLink />
						</A>
					</Skeleton>
				</div>
				<Toggle label={c.app.form.detail.active()} disabled />
			</div>
			<hr class="border-pv-blue-200" />
			<div class="flex flex-row flex-wrap items-center justify-between gap-4">
				<div class="flex gap-4">
					<div class="flex flex-col gap-1">
						<p class="text-pv-blue-400 text-sm">{c.app.form.detail.totalVisits()}</p>
						<Skeleton radius={15}>
							<p class="font-bold text-lg text-pv-blue-500">123</p>
						</Skeleton>
					</div>
					<div class="flex flex-col gap-1">
						<p class="text-pv-blue-400 text-sm">{c.app.form.detail.uniqueVisits()}</p>
						<Skeleton radius={15}>
							<p class="font-bold text-lg text-pv-blue-500">123</p>
						</Skeleton>
					</div>
				</div>
				<div class="flex gap-2">
					<Skeleton radius={9999}>
						<Button icon={<FaSolidShare />} disabled>
							{c.app.form.detail.share()}
						</Button>
					</Skeleton>
					<Skeleton radius={9999}>
						<Button icon={<FaSolidShare />} disabled>
							{c.app.form.detail.share()}
						</Button>
					</Skeleton>
				</div>
			</div>
		</div>
	);
}
