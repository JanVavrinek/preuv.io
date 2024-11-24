import { organizationsContext } from "@contexts/Organizations";
import useI18n from "@lib/i18n/hooks/useI18n";
import AppLayoutTitle from "@molecules/layouts/App/layout/AppLayoutTitle";
import General from "@molecules/layouts/App/views/Organization/General";
import Invites from "@molecules/layouts/App/views/Organization/Invites";
import Members from "@molecules/layouts/App/views/Organization/Members";
import Roles from "@molecules/layouts/App/views/Organization/Roles";
import { useNavigate } from "@solidjs/router";
import { createEffect, useContext } from "solid-js";

export default function OrganizationView() {
	const { c } = useI18n();
	const { activeOrganization } = useContext(organizationsContext);
	const navigate = useNavigate();

	createEffect(() => {
		const org = activeOrganization();
		if (!org) navigate("/app/dashboard");
	});

	return (
		<>
			<AppLayoutTitle>{`${activeOrganization()?.organization.name} — ${c.app.organization.edit.title()}`}</AppLayoutTitle>
			<div class="w-full flex-grow p-4">
				<div class="min-h-full w-full rounded-xl border border-pv-blue-200 bg-pv-blue-50 p-5 shadow-lg">
					<General />
					<Roles />
					<Members />
					<Invites />
				</div>
			</div>
		</>
	);
}
