import Button from "@atoms/Button";
import Collapsible from "@atoms/Collapsible";
import Pagination from "@atoms/Pagination";
import { toast } from "@atoms/Toaster";
import { organizationsContext } from "@contexts/Organizations";
import { Dialog } from "@kobalte/core/dialog";
import type { InviteSelectModel } from "@lib/db/schemas/invite";
import type { RoleSelectModel } from "@lib/db/schemas/role";
import type { UserSelectModel } from "@lib/db/schemas/user";
import useI18n from "@lib/i18n/hooks/useI18n";
import { client } from "@lib/trpc/client";
import ConfirmDelete from "@molecules/common/ConfirmDelete";
import { FaSolidTrash } from "solid-icons/fa";
import { For, batch, createEffect, createSignal, on, useContext } from "solid-js";
import { createStore } from "solid-js/store";
import useAsync from "../../../../../../../hooks/useAsync";

const LIMIT = 20;

export default function Invites() {
	const { c } = useI18n();
	const [invites, setInvites] = createStore<{
		items: { invite: InviteSelectModel; user: UserSelectModel; role: RoleSelectModel }[];
		total: number;
	}>({
		items: [],
		total: 0,
	});
	const [page, setPage] = createSignal(1);
	const { handler, loading } = useAsync(client.organization.invite.getMany.query);
	const { activeOrganization } = useContext(organizationsContext);

	const handleFetch = () => {
		if (loading()) return;
		handler({ limit: LIMIT, offset: (page() - 1) * LIMIT }).then(setInvites);
	};

	createEffect(on(page, handleFetch));

	createEffect(
		on(activeOrganization, () => {
			batch(() => {
				setPage((s) => {
					if (s === 1) handleFetch();
					return 1;
				});
				setInvites("items", []);
				setInvites("total", 0);
				handleFetch();
			});
		}),
	);

	const handleDeleteInvite = async (userId: UserSelectModel["id"]) => {
		const p = client.organization.invite.delete.mutate(userId);
		toast.promise(p, {
			loading: { title: c.generic.toasts.deleting.loading() },
			success: () => ({ title: c.generic.toasts.deleting.success() }),
			error: () => ({ title: c.generic.toasts.deleting.error() }),
		});
		setInvites("items", (s) => s.filter((i) => i.user.id !== userId));
		setInvites("total", (s) => s - 1);
	};

	return (
		<Collapsible triggerChildren={c.app.invite.title()}>
			<div class="flex w-full flex-col gap-2">
				<table class="w-full border-separate border-spacing-0 rounded-t-xl border border-pv-blue-200">
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
						<For each={invites.items}>
							{(invite) => (
								<tr class="group">
									<td class="py-2 pr-2 pl-3 group-even:bg-pv-blue-100 group-last-of-type:rounded-bl-xl">
										{invite.user.name}
									</td>
									<td class="py-2 pr-2 pl-3 group-even:bg-pv-blue-100">{invite.role.name}</td>
									<td class="py-2 pr-2 pl-3 group-even:bg-pv-blue-100 group-last-of-type:rounded-br-xl">
										<ConfirmDelete onConfirm={() => handleDeleteInvite(invite.user.id)}>
											<Dialog.Trigger as={Button} variant="danger" class="aspect-square">
												<FaSolidTrash />
											</Dialog.Trigger>
										</ConfirmDelete>
									</td>
								</tr>
							)}
						</For>
					</tbody>
				</table>
				<div class="flex flex-wrap justify-between gap-2">
					<Pagination count={Math.max(1, Math.ceil(invites.total / LIMIT))} page={page()} onPageChange={setPage} />
				</div>
			</div>
		</Collapsible>
	);
}
