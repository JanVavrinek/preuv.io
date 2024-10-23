import Collapsible from "@atoms/Collapsible";
import { organizationsContext } from "@contexts/Organizations";
import useI18n from "@lib/i18n/hooks/useI18n";
import AppLayoutTitle from "@molecules/App/AppLayoutTitle";
import General from "@molecules/App/views/Organization/General";
import { useNavigate } from "@solidjs/router";
import { createMemo, useContext } from "solid-js";

export default function OrganizationView() {
	const { c } = useI18n();
	const { organizations } = useContext(organizationsContext);
	const navigate = useNavigate();
	const active = createMemo(() => {
		const org = organizations.organizations.find((o) => o.organization.id === organizations.active);
		if (!org) {
			navigate("/app/dashboard");
		}
		return org;
	});
	return (
		<>
			<AppLayoutTitle>{`${active()?.organization.name} — ${c.app.organization.edit.title()}`}</AppLayoutTitle>
			<div class="w-full flex-grow p-4">
				<div class="min-h-full w-full rounded-xl border border-pv-blue-200 bg-pv-blue-50 p-5 shadow-lg">
					<Collapsible triggerChildren="General" defaultOpen>
						<General />
					</Collapsible>
				</div>
			</div>
		</>
	);
}
