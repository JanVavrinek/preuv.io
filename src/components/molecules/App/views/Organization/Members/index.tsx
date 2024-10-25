import Collapsible from "@atoms/Collapsible";
import Pagination from "@atoms/Pagination";
import type { Role } from "@contexts/Organizations/types";
import type { MemberSelectModel } from "@lib/db/schemas/member";
import type { UserSelectModel } from "@lib/db/schemas/user";
import useI18n from "@lib/i18n/hooks/useI18n";
import { client } from "@lib/trpc/client";
import {} from "solid-icons/fa";
import { For, createEffect, createSignal, on } from "solid-js";
import { createStore } from "solid-js/store";
import useAsync from "../../../../../../hooks/useSignOut/useAsync";

const LIMIT = 20;

export default function Members() {
	const { c } = useI18n();
	const [members, setRoles] = createStore<{
		items: { role: Role; member: MemberSelectModel; user: UserSelectModel }[];
		total: number;
	}>({ items: [], total: 0 });
	const [page, setPage] = createSignal(1);
	const { handler, loading } = useAsync(client.member.getMany.query);

	createEffect(
		on(page, () => {
			if (loading()) return;
			handler({ limit: LIMIT, offset: (page() - 1) * LIMIT }).then(setRoles);
		}),
	);

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
							{(member, index) => (
								<tr class="group">
									<td class="py-2 pr-2 pl-3 group-even:bg-pv-blue-100 group-last-of-type:rounded-bl-xl">
										{member.user.name}
									</td>
									<td class="py-2 pr-2 pl-3 group-even:bg-pv-blue-100">{member.role.name}</td>
									<td class="py-2 pr-2 pl-3 group-even:bg-pv-blue-100 group-last-of-type:rounded-br-xl" />
								</tr>
							)}
						</For>
					</tbody>
				</table>
				<div class="flex flex-wrap justify-between gap-2">
					<Pagination count={Math.max(1, Math.ceil(members.total / LIMIT))} page={page()} onPageChange={setPage} />
				</div>
			</div>
		</Collapsible>
	);
}
