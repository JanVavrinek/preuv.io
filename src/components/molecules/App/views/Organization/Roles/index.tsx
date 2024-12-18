import Button from "@atoms/Button";
import Collapsible from "@atoms/Collapsible";
import Pagination from "@atoms/Pagination";
import PermissionsGuard from "@atoms/PermissionsGuard";
import { organizationsContext } from "@contexts/Organizations";
import type { Role } from "@contexts/Organizations/types";
import { Dialog } from "@kobalte/core/dialog";
import { RolePermissions } from "@lib/db/schemas/role";
import useI18n from "@lib/i18n/hooks/useI18n";
import { client } from "@lib/trpc/client";
import { FaSolidGear, FaSolidPlus } from "solid-icons/fa";
import { For, Show, batch, createEffect, createSignal, on, useContext } from "solid-js";
import { createStore, reconcile } from "solid-js/store";
import useAsync from "../../../../../../hooks/useAsync";
import EditRole from "../EditRole";

const LIMIT = 20;

export default function Roles() {
	const { c } = useI18n();
	const [roles, setRoles] = createStore<{ items: Role[]; total: number }>({ items: [], total: 0 });
	const [page, setPage] = createSignal(1);
	const { handler, loading } = useAsync(client.role.getMany.query);
	const { activeOrganization } = useContext(organizationsContext);

	const handleFetch = () => {
		if (loading()) return;
		handler({ limit: LIMIT, offset: (page() - 1) * LIMIT }).then(setRoles);
	};

	createEffect(on(page, handleFetch));

	createEffect(
		on(activeOrganization, () => {
			batch(() => {
				setPage((s) => {
					if (s === 1) handleFetch();
					return 1;
				});
				setRoles("items", []);
				setRoles("total", 0);
				handleFetch();
			});
		}),
	);

	return (
		<Collapsible triggerChildren={c.app.organization.roles.title()}>
			<div class="flex w-full flex-col gap-2">
				<table class="w-full border-separate border-spacing-0 rounded-xl border border-pv-blue-200">
					<thead>
						<tr>
							<th class="rounded-tl-xl border-pv-blue-200 border-b bg-pv-blue-200 p-2 text-start">
								{c.app.organization.roles.name()}
							</th>
							<th class="border-pv-blue-200 border-b bg-pv-blue-200 p-2 text-start">
								{c.app.organization.roles.permissions.title()}
							</th>
							<th class="w-9 rounded-tr-xl border-pv-blue-200 border-b bg-pv-blue-200 p-2 text-start" />
						</tr>
					</thead>
					<tbody>
						<For each={roles.items}>
							{(role, index) => (
								<tr class="group">
									<td class="py-2 pr-2 pl-3 group-even:bg-pv-blue-100 group-last-of-type:rounded-bl-xl">{role.name}</td>
									<td class="py-2 pr-2 pl-3 group-even:bg-pv-blue-100">
										<Show when={role.owner} fallback={role.permissions.length}>
											{c.generic.common.all()}
										</Show>
									</td>
									<td class="py-2 pr-2 pl-3 group-even:bg-pv-blue-100 group-last-of-type:rounded-br-xl">
										<EditRole
											role={role}
											onUpdated={(r) => setRoles("items", index(), reconcile(r))}
											openTrigger={
												<Button icon={<FaSolidGear />} class="gap-2" as={Dialog.Trigger}>
													{c.generic.actions.edit()}
												</Button>
											}
											onDeleted={() => setRoles("items", (s) => s.filter((r) => r.id !== role.id))}
										/>
									</td>
								</tr>
							)}
						</For>
					</tbody>
				</table>
				<div class="flex flex-wrap justify-between gap-2">
					<PermissionsGuard permissions={[RolePermissions.ROLE_CREATE]}>
						<EditRole
							onUpdated={(r) => setRoles("items", (s) => [...s, r])}
							openTrigger={
								<Button icon={<FaSolidPlus />} class="gap-2" as={Dialog.Trigger}>
									{c.generic.actions.addNew()}
								</Button>
							}
						/>
					</PermissionsGuard>
					<Pagination count={Math.max(1, Math.ceil(roles.total / LIMIT))} page={page()} onPageChange={setPage} />
				</div>
			</div>
		</Collapsible>
	);
}
