import Button from "@atoms/Button";
import Collapsible from "@atoms/Collapsible";
import PermissionsGuard from "@atoms/PermissionsGuard";
import { toast } from "@atoms/Toaster";
import useAsync from "@hooks/useAsync";
import { Dialog } from "@kobalte/core/dialog";
import { RolePermissions } from "@lib/db/schemas/role";
import useI18n from "@lib/i18n/hooks/useI18n";
import { client } from "@lib/trpc/client";
import ConfirmDelete from "@molecules/common/ConfirmDelete";
import { useNavigate } from "@solidjs/router";
import { FaSolidTrash } from "solid-icons/fa";
import type { VoidProps } from "solid-js";
import type { DangerZoneProps } from "./types";

export default function DangerZone(props: VoidProps<DangerZoneProps>) {
	const { c } = useI18n();
	const navigate = useNavigate();
	const { handler, loading } = useAsync(client.project.delete.mutate);

	const handleDelete = async () => {
		if (loading()) return;
		const p = handler(props.projectId);
		toast.promise(p, {
			loading: { title: c.generic.toasts.deleting.loading() },
			success: () => ({ title: c.generic.toasts.deleting.success() }),
			error: () => ({ title: c.generic.toasts.deleting.error() }),
		});

		navigate("/app/dashboard");
	};

	return (
		<PermissionsGuard permissions={[RolePermissions.PROJECT_DELETE]}>
			<Collapsible triggerChildren={c.generic.common.dangerZone()}>
				<ConfirmDelete onConfirm={handleDelete}>
					<Dialog.Trigger as={Button} icon={<FaSolidTrash />} variant="danger" disabled={loading()} class="mt-2">
						{c.generic.actions.delete()}
					</Dialog.Trigger>
				</ConfirmDelete>
			</Collapsible>
		</PermissionsGuard>
	);
}
