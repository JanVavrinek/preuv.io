import Collapsible from "@atoms/Collapsible";
import Pagination from "@atoms/Pagination";
import PermissionsGuard from "@atoms/PermissionsGuard";
import useHasPermissions from "@atoms/PermissionsGuard/hooks/useHasPermissions";
import { organizationsContext } from "@contexts/Organizations";
import type { Role } from "@contexts/Organizations/types";
import { userContext } from "@contexts/User";
import type { MemberSelectModel } from "@lib/db/schemas/member";
import { RolePermissions } from "@lib/db/schemas/role";
import type { UserSelectModel } from "@lib/db/schemas/user";
import useI18n from "@lib/i18n/hooks/useI18n";
import { client } from "@lib/trpc/client";
import {} from "solid-icons/fa";
import { For, Show, batch, createEffect, createSignal, on, useContext } from "solid-js";
import { createStore } from "solid-js/store";
import useAsync from "../../../../../../hooks/useAsync";
import DeleteMember from "../DeleteMember";
import Invite from "./components/Invite";

const LIMIT = 20;

export default function Members() {
	const { c } = useI18n();
	const [members, setMembers] = createStore<{
		items: { role: Role; member: MemberSelectModel; user: UserSelectModel }[];
		total: number;
	}>({ items: [], total: 0 });
	const [page, setPage] = createSignal(1);
	const { handler, loading } = useAsync(client.member.getMany.query);
	const { activeOrganization, setOrganizations } = useContext(organizationsContext);
	const check = useHasPermissions();
	const { user } = useContext(userContext);

	const handleFetch = () => {
		if (loading()) return;
		handler({ limit: LIMIT, offset: (page() - 1) * LIMIT }).then(setMembers);
	};

	createEffect(on(page, handleFetch));

	createEffect(
		on(activeOrganization, () => {
			batch(() => {
				setPage((s) => {
					if (s === 1) handleFetch();
					return 1;
				});
				setMembers("items", []);
				setMembers("total", 0);
			});
		}),
	);

	const handleRemove = (userId: MemberSelectModel["user_id"]) => {
		setMembers("items", (s) => s.filter((i) => i.member.user_id !== userId));
		if (userId !== user.id) return;
		setOrganizations("organizations", (s) => {
			const filtered = s.filter((o) => o.organization.id !== activeOrganization()?.organization.id);
			const newActive = filtered.at(0);
			setOrganizations("active", newActive?.organization.id);
			return filtered;
		});
	};

	return (
		<Collapsible triggerChildren={c.app.organization.members.title()}>
			<div class="flex w-full flex-col gap-2">
				<table class="w-full border-separate border-spacing-0 rounded-xl border border-pv-blue-200">
					<thead>
						<tr>
							<th class="rounded-tl-xl border-pv-blue-200 border-b bg-pv-blue-200 p-2 text-start">
								{c.app.account.username()}
							</th>
							<th class="border-pv-blue-200 border-b bg-pv-blue-200 p-2 text-start">
								{c.app.organization.roles.name()}
							</th>
							<th class="w-9 rounded-tr-xl border-pv-blue-200 border-b bg-pv-blue-200 p-2 text-start" />
						</tr>
					</thead>
					<tbody>
						<For each={members.items}>
							{(member) => (
								<tr class="group">
									<td class="py-2 pr-2 pl-3 group-even:bg-pv-blue-100 group-last-of-type:rounded-bl-xl">
										{member.user.name}
									</td>
									<td class="py-2 pr-2 pl-3 group-even:bg-pv-blue-100">{member.role.name}</td>
									<td class="py-2 pr-2 pl-3 group-even:bg-pv-blue-100 group-last-of-type:rounded-br-xl">
										<Show
											when={
												!member.role.owner &&
												(check([RolePermissions.MEMBER_DELETE]) || user.id === member.member.user_id)
											}
										>
											<DeleteMember
												userId={member.member.user_id}
												onDelete={() => handleRemove(member.member.user_id)}
											/>
										</Show>
									</td>
								</tr>
							)}
						</For>
					</tbody>
				</table>
				<div class="flex flex-row flex-wrap items-center justify-between gap-2">
					<PermissionsGuard permissions={[RolePermissions.INVITE_CREATE]}>
						<Invite />
					</PermissionsGuard>
					<div class="flex flex-wrap justify-between gap-2">
						<Pagination count={Math.max(1, Math.ceil(members.total / LIMIT))} page={page()} onPageChange={setPage} />
					</div>
				</div>
			</div>
		</Collapsible>
	);
}
