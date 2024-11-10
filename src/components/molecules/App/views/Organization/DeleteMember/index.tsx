import Button from "@atoms/Button";
import { toast } from "@atoms/Toaster";
import { userContext } from "@contexts/User";
import { Dialog } from "@kobalte/core/dialog";
import useI18n from "@lib/i18n/hooks/useI18n";
import { client } from "@lib/trpc/client";
import ConfirmDelete from "@molecules/common/ConfirmDelete";
import { AiOutlineUserDelete } from "solid-icons/ai";
import { IoExitOutline } from "solid-icons/io";
import { Show, type VoidProps, useContext } from "solid-js";
import type { DeleteMemberProps } from "./types";

export default function DeleteMember(props: VoidProps<DeleteMemberProps>) {
	const { c } = useI18n();
	const { user } = useContext(userContext);

	const handleDelete = () => {
		const p = client.member.delete.mutate(props.userId);

		toast.promise(p, {
			loading: { title: c.generic.toasts.saving.loading() },
			success: () => ({ title: c.generic.toasts.saving.success() }),
			error: () => ({ title: c.generic.toasts.saving.error() }),
		});
		p.then(props.onDelete);
	};

	return (
		<ConfirmDelete
			onConfirm={handleDelete}
			title={user.id === props.userId ? `${c.app.organization.members.leave()} ? ` : `${c.generic.actions.remove()} ?`}
			confirmTitle={user.id === props.userId ? c.app.organization.members.leave() : c.generic.actions.remove()}
		>
			<Dialog.Trigger
				as={Button}
				variant="danger"
				icon={
					<Show when={user.id === props.userId} fallback={<AiOutlineUserDelete />}>
						<IoExitOutline />
					</Show>
				}
			>
				<Show when={user.id === props.userId} fallback={c.generic.actions.remove()}>
					{c.app.organization.members.leave()}
				</Show>
			</Dialog.Trigger>
		</ConfirmDelete>
	);
}
