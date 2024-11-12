import Button from "@atoms/Button";
import useI18n from "@lib/i18n/hooks/useI18n";
import { setOpenCreateOrganization } from "@molecules/App/Sidebar";
import { FaSolidPlus } from "solid-icons/fa";

export default function NoActiveOrganization() {
	const { c } = useI18n();
	return (
		<div class="flex w-full flex-grow justify-center ">
			<div class="my-auto flex flex-col gap-2 p-2 text-center">
				<h1 class="text-4xl text-pv-blue-500">{c.app.dashboard.noOrganization.title()}</h1>
				<p class="text-pv-blue-400">{c.app.dashboard.noOrganization.subTitle()}</p>
				<Button class="mt-5" icon={<FaSolidPlus />} onclick={() => setOpenCreateOrganization(true)}>
					{c.app.organization.create()}
				</Button>
			</div>
		</div>
	);
}
