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
import { Show, useContext } from "solid-js";
import formContext from "../../contexts/Form";

export default function Danger() {
	const { formData } = useContext(formContext);
	const { c } = useI18n();
	const { handler, loading } = useAsync(client.form.delete.mutate);
	const navigate = useNavigate();

	const handleDelete = async () => {
		const id = formData()?.form.id;
		if (loading() || !id) return;
		const p = handler(id);

		toast.promise(p, {
			loading: { title: c.generic.toasts.deleting.loading() },
			success: () => ({ title: c.generic.toasts.deleting.success() }),
			error: () => ({ title: c.generic.toasts.deleting.error() }),
		});

		p.then(() => navigate(`/app/forms?project=${formData()?.project.id}`));
	};

	return (
		<Show when={formData()?.form.id.length}>
			<PermissionsGuard permissions={[RolePermissions.FORM_DELETE]}>
				<Collapsible triggerChildren={c.generic.common.dangerZone()}>
					<ConfirmDelete onConfirm={handleDelete}>
						<Dialog.Trigger as={Button} variant="danger" class="mt-2">
							{c.generic.actions.delete()}
						</Dialog.Trigger>
					</ConfirmDelete>
				</Collapsible>
			</PermissionsGuard>
		</Show>
	);
}
