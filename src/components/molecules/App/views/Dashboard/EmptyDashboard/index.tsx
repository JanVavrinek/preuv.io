import Button from "@atoms/Button";
import useI18n from "@lib/i18n/hooks/useI18n";
import { A } from "@solidjs/router";
import { FaSolidPlus } from "solid-icons/fa";

export default function EmptyDashboard() {
	const { c } = useI18n();
	return (
		<div class="hidden w-full flex-grow justify-center first:flex">
			<div class="my-auto flex flex-col gap-2 p-2 text-center">
				<h1 class="text-4xl text-pv-blue-500">{c.app.dashboard.empty.title()}</h1>
				<p class="text-pv-blue-400">{c.app.dashboard.empty.subTitle()}</p>
				<Button class="mt-5" icon={<FaSolidPlus />} as={A} href="/app/project/create">
					{c.app.dashboard.empty.createProject()}
				</Button>
			</div>
		</div>
	);
}
