import Button from "@atoms/Button";
import PermissionsGuard from "@atoms/PermissionsGuard";
import { toast } from "@atoms/Toaster";
import Toggle from "@atoms/Toggle";
import useAsync from "@hooks/useAsync";
import { Dialog } from "@kobalte/core/dialog";
import { RolePermissions } from "@lib/db/schemas/role";
import useI18n from "@lib/i18n/hooks/useI18n";
import { client } from "@lib/trpc/client";
import ConfirmDelete from "@molecules/common/ConfirmDelete";
import { A } from "@solidjs/router";
import { FaSolidGear, FaSolidShare, FaSolidTrash } from "solid-icons/fa";
import { FiExternalLink } from "solid-icons/fi";
import type { VoidProps } from "solid-js";
import type { FormProps } from "./types";

export default function Form(props: VoidProps<FormProps>) {
	const { c } = useI18n();
	const { handler, loading } = useAsync(client.form.update.mutate);
	const { handler: deleteHandler, loading: deleteLoading } = useAsync(client.form.delete.mutate);

	const handleApprove = async () => {
		if (loading()) return;
		const p = handler({
			id: props.form.form.id,
			data: {
				active: !props.form.form.active,
			},
		});

		toast.promise(p, {
			loading: { title: c.generic.toasts.saving.loading() },
			success: () => ({ title: c.generic.toasts.saving.success() }),
			error: () => ({ title: c.generic.toasts.saving.error() }),
		});

		props.onUpdate?.(await p);
	};

	const handleDelete = async () => {
		if (deleteLoading()) return;
		const p = deleteHandler(props.form.form.id);

		toast.promise(p, {
			loading: { title: c.generic.toasts.deleting.loading() },
			success: () => ({ title: c.generic.toasts.deleting.success() }),
			error: () => ({ title: c.generic.toasts.deleting.error() }),
		});

		props.onDelete?.();
	};

	return (
		<div class="flex flex-col gap-2 rounded-xl border border-pv-blue-200 bg-pv-blue-100 p-2">
			<div class="flex items-center justify-between gap-2">
				<div class="flex flex-col">
					<p class="font-semibold text-xl">{props.form.form.name}</p>
					<A class="flex items-center gap-2 text-pv-navy-500" href={`/app/project/${props.form.project.id}`}>
						{props.form.project.name}
						<FiExternalLink />
					</A>
				</div>
				<Toggle checked={props.form.form.active} onChange={handleApprove} label={c.app.form.detail.active()} />
			</div>
			<hr class="border-pv-blue-200" />
			<div class="flex flex-row flex-wrap items-center justify-between gap-4">
				<div class="flex gap-4">
					<div class="flex flex-col gap-1">
						<p class="text-pv-blue-400 text-sm">{c.app.form.detail.totalVisits()}</p>
						<p class="font-bold text-lg text-pv-blue-500">{props.form.total_visits}</p>
					</div>
					<div class="flex flex-col gap-1">
						<p class="text-pv-blue-400 text-sm">{c.app.form.detail.uniqueVisits()}</p>
						<p class="font-bold text-lg text-pv-blue-500">{props.form.unique_visits}</p>
					</div>
				</div>
				<div class="flex gap-2">
					<Button icon={<FaSolidShare />} as={A} href={`/app/forms/share/${props.form.form.id}/link`}>
						{c.app.form.detail.share()}
					</Button>
					<PermissionsGuard permissions={[RolePermissions.FORM_UPDATE]}>
						<ConfirmDelete onConfirm={handleDelete}>
							<Dialog.Trigger as={Button} icon={<FaSolidTrash />} variant="danger" disabled={deleteLoading()}>
								{c.generic.actions.delete()}
							</Dialog.Trigger>
						</ConfirmDelete>
					</PermissionsGuard>
					<PermissionsGuard permissions={[RolePermissions.FORM_UPDATE]}>
						<Button as={A} href={`/app/forms/${props.form.form.id}`} icon={<FaSolidGear />} disabled={loading()}>
							{c.generic.actions.edit()}
						</Button>
					</PermissionsGuard>
				</div>
			</div>
		</div>
	);
}
