import Button from "@atoms/Button";
import { Dialog } from "@atoms/Dialog";
import InterSectionObserver from "@atoms/IntersectionObserver";
import Skeleton from "@atoms/Skeleton";
import { toast } from "@atoms/Toaster";
import { organizationsContext } from "@contexts/Organizations";
import useAsync from "@hooks/useAsync";
import { Dialog as KDialog } from "@kobalte/core/dialog";
import type { InviteSelectModel } from "@lib/db/schemas/invite";
import type { OrganizationSelectModel } from "@lib/db/schemas/organization";
import useI18n from "@lib/i18n/hooks/useI18n";
import { client } from "@lib/trpc/client";
import { formatDate } from "@utils/time";
import { FaSolidBell, FaSolidCheck, FaSolidXmark } from "solid-icons/fa";
import { For, Show, type VoidProps, batch, useContext } from "solid-js";
import { createStore } from "solid-js/store";

const LIMIT = 20;

function InviteItem(
	props: VoidProps<{
		invite?: { organization: string; created_at: Date };
		onJoin?: () => void;
		onDecline?: () => void;
	}>,
) {
	const { locale, c } = useI18n();

	return (
		<li class="flex flex-row flex-wrap items-center justify-between gap-2 border-pv-blue-200 border-b p-2 odd:bg-pv-blue-100 first-of-type:rounded-t-xl last-of-type:rounded-b-xl last-of-type:border-none">
			<div
				class="flex flex-col"
				classList={{
					"gap-1": !props.invite?.organization,
				}}
			>
				<Skeleton radius={10} visible={!props.invite?.organization}>
					<h4 class="text-xl">{props.invite?.organization ?? "organization"}</h4>
				</Skeleton>
				<Skeleton visible={!props.invite?.organization} radius={10}>
					<time datetime={props.invite?.created_at.toISOString()} class="text-pv-blue-400 text-xs">
						{formatDate(props.invite?.created_at ?? new Date(), locale(), {
							day: "2-digit",
							month: "2-digit",
							year: "2-digit",
							hour: "2-digit",
							minute: "2-digit",
						})}
					</time>
				</Skeleton>
			</div>
			<div class="flex gap-2">
				<Skeleton visible={!props.onJoin} radius={9999}>
					<Button icon={<FaSolidCheck />} onclick={props.onJoin}>
						{c.app.invite.join()}
					</Button>
				</Skeleton>
				<Skeleton visible={!props.onDecline} radius={9999}>
					<Button variant="danger" icon={<FaSolidXmark />} onclick={props.onDecline}>
						{c.app.invite.decline()}
					</Button>
				</Skeleton>
			</div>
		</li>
	);
}

export default function Invites() {
	const { c } = useI18n();
	const [invites, setInvites] = createStore<{
		items: { invite: InviteSelectModel; organization: OrganizationSelectModel }[];
		total: number;
	}>({
		items: [],
		total: -1,
	});
	const { handler, loading } = useAsync(client.invite.getMany.query);
	const { setOrganizations } = useContext(organizationsContext);

	const handleLoad = () => {
		if (loading() || invites.items.length === invites.total) return;
		handler({ limit: LIMIT, offset: invites.items.length }).then((res) => {
			batch(() => {
				setInvites("items", (s) => [...s, ...res.items]);
				setInvites("total", res.total);
			});
		});
	};

	const handleInvite = (organization: OrganizationSelectModel["id"], accept = true) => {
		let p: Promise<void>;
		if (accept) p = client.invite.accept.mutate(organization);
		else p = client.invite.decline.mutate(organization);

		toast.promise(p, {
			loading: { title: c.generic.toasts.saving.loading() },
			success: () => ({ title: c.generic.toasts.saving.success() }),
			error: () => ({ title: c.generic.toasts.saving.error() }),
		});

		batch(() => {
			setInvites("items", (s) => s.filter((i) => i.invite.organization_id !== organization));
			setInvites("total", (s) => s - 1);
		});
		if (accept)
			p.then(() => {
				client.organization.getOne.query(organization).then((res) => {
					if (res) {
						setOrganizations("organizations", (s) => [...s, res]);
						setOrganizations("active", res.organization.id);
					}
				});
			});
	};

	return (
		<Dialog
			openTrigger={
				<KDialog.Trigger>
					<FaSolidBell />
				</KDialog.Trigger>
			}
			title={c.app.invite.title()}
			onOpenChange={(v) => {
				if (!v) setInvites("total", -1);
			}}
		>
			<InterSectionObserver onIntersection={handleLoad}>
				<ol>
					<For
						each={invites.items}
						fallback={
							<Show
								when={invites.total === -1}
								fallback={<p class="text-center font-semibold text-pv-blue-700">{c.app.invite.noInvites()}</p>}
							>
								<InviteItem />
								<InviteItem />
							</Show>
						}
					>
						{(item) => (
							<InviteItem
								invite={{ created_at: item.invite.created_at, organization: item.organization.name }}
								onJoin={() => handleInvite(item.invite.organization_id)}
								onDecline={() => handleInvite(item.invite.organization_id, false)}
							/>
						)}
					</For>
				</ol>
			</InterSectionObserver>
		</Dialog>
	);
}
