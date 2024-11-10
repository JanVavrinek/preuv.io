import Button from "@atoms/Button";
import Collapsible from "@atoms/Collapsible";
import { Dialog } from "@atoms/Dialog";
import Input from "@atoms/Input";
import PermissionsGuard from "@atoms/PermissionsGuard";
import useHasPermissions from "@atoms/PermissionsGuard/hooks/useHasPermissions";
import { toast } from "@atoms/Toaster";
import Toggle from "@atoms/Toggle";
import { Dialog as KDialog } from "@kobalte/core/dialog";
import { RolePermissions, type RoleSelectModel, roleSelectModelSchema } from "@lib/db/schemas/role";
import useI18n from "@lib/i18n/hooks/useI18n";
import { client } from "@lib/trpc/client";
import { createForm, zodForm } from "@modular-forms/solid";
import ConfirmDelete from "@molecules/common/ConfirmDelete";
import { FaSolidTrash } from "solid-icons/fa";
import { type ComponentProps, Index, Show, type VoidProps, createSignal } from "solid-js";
import type { EditRoleProps } from "./types";
const schema = roleSelectModelSchema.pick({
	name: true,
});

export default function EditRole(props: VoidProps<EditRoleProps>) {
	const { c } = useI18n();
	const [open, setOpen] = createSignal(false);
	const [permissions, setPermissions] = createSignal(props.role?.permissions ?? []);
	const [roleForm, { Field, Form }] = createForm({
		validate: zodForm(schema),
		initialValues: {
			name: props.role?.name,
		},
	});
	const check = useHasPermissions();

	const handleSubmit: ComponentProps<typeof Form>["onSubmit"] = async (values) => {
		let p: Promise<RoleSelectModel>;

		if (props.role) {
			p = client.role.update.mutate({
				id: props.role.id,
				name: values.name,
				permissions: permissions(),
			});
		} else {
			p = client.role.create.mutate({
				name: values.name,
				permissions: permissions(),
			});
		}
		toast.promise(p, {
			loading: { title: c.generic.toasts.saving.loading() },
			success: () => ({ title: c.generic.toasts.saving.success() }),
			error: () => ({ title: c.generic.toasts.saving.error() }),
		});

		props.onUpdated(await p);
		setOpen(false);
	};

	const handleTogglePermission = (permission: RolePermissions, toggle: boolean) => {
		if (toggle) setPermissions((s) => [...s, permission]);
		else setPermissions((s) => s.filter((p) => p !== permission));
	};

	const handleDelete = async () => {
		if (!props.role) return;
		const p = client.role.delete.mutate(props.role.id);
		toast.promise(p, {
			loading: { title: c.generic.toasts.deleting.loading() },
			success: () => ({ title: c.generic.toasts.deleting.success() }),
			error: () => ({ title: c.generic.toasts.deleting.error() }),
		});
		await p;
		props.onDeleted?.();
		setOpen(false);
	};

	return (
		<Dialog
			openTrigger={props.openTrigger}
			title={props.role ? `${props.role.name} — ${c.generic.actions.edit()}` : c.app.organization.roles.new()}
			open={open()}
			onOpenChange={setOpen}
		>
			<Form onSubmit={handleSubmit} class="flex flex-col gap-2">
				<Field name="name">
					{(field, props) => (
						<Input
							inputProps={props}
							value={field.value}
							required
							label={c.app.organization.roles.name()}
							parseResult={schema.shape[field.name].safeParse(field.value)}
							showErrors={!!field.error.length}
							placeholder={c.app.organization.roles.owner()}
							readOnly={!check([RolePermissions.ROLE_UPDATE])}
						/>
					)}
				</Field>
				<Collapsible triggerChildren={c.app.organization.roles.permissions.title()}>
					<table class="w-full border-separate border-spacing-0 rounded-xl border border-pv-blue-200">
						<thead>
							<tr>
								<th class="rounded-tl-xl border-pv-blue-200 border-b bg-pv-blue-200 p-2 text-start">
									{c.app.organization.roles.name()}
								</th>
								<th class="w-9 rounded-tr-xl border-pv-blue-200 border-b bg-pv-blue-200 p-2 text-start" />
							</tr>
						</thead>
						<tbody>
							<Index each={Object.values(RolePermissions)}>
								{(p) => (
									<tr class="group">
										<td class="py-2 pr-2 pl-3 group-even:bg-pv-blue-100">
											{c.app.organization.roles.permissions.names[p()]()}
										</td>
										<td class="py-2 pr-2 pl-3 group-even:bg-pv-blue-100 group-last-of-type:rounded-br-xl">
											<Toggle
												checked={permissions().includes(p()) || !!props.role?.owner}
												onChange={(v) => handleTogglePermission(p(), v)}
												disabled={!!props.role?.owner || !check([RolePermissions.ROLE_UPDATE])}
											/>
										</td>
									</tr>
								)}
							</Index>
						</tbody>
					</table>
				</Collapsible>
				<Show when={props.onDeleted && !props.role?.owner && check([RolePermissions.ROLE_DELETE])}>
					<Collapsible triggerChildren={c.generic.common.dangerZone()}>
						<ConfirmDelete onConfirm={handleDelete}>
							<KDialog.Trigger as={Button} variant="danger" icon={<FaSolidTrash />} class="mt-2">
								{c.generic.actions.delete()}
							</KDialog.Trigger>
						</ConfirmDelete>
					</Collapsible>
				</Show>
				<PermissionsGuard permissions={[RolePermissions.ROLE_UPDATE]}>
					<Button type="submit" disabled={roleForm.invalid || roleForm.submitting}>
						{c.generic.actions.save()}
					</Button>
				</PermissionsGuard>
			</Form>
		</Dialog>
	);
}
