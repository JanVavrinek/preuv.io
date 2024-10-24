import Button from "@atoms/Button";
import Collapsible from "@atoms/Collapsible";
import { Dialog } from "@atoms/Dialog";
import Input from "@atoms/Input";
import { toast } from "@atoms/Toaster";
import Toggle from "@atoms/Toggle";
import { RolePermissions, roleSelectModelSchema } from "@lib/db/schemas/role";
import useI18n from "@lib/i18n/hooks/useI18n";
import { client } from "@lib/trpc/client";
import { createForm, zodForm } from "@modular-forms/solid";
import { type ComponentProps, Index, type VoidProps, createSignal } from "solid-js";
import type { EditRoleProps } from "./types";

const schema = roleSelectModelSchema.pick({
	name: true,
});

export default function EditRole(props: VoidProps<EditRoleProps>) {
	const [open, setOpen] = createSignal(false);
	const { c } = useI18n();
	const [roleForm, { Field, Form }] = createForm({
		validate: zodForm(schema),
		initialValues: {
			name: props.role.name,
		},
	});

	const handleSubmit: ComponentProps<typeof Form>["onSubmit"] = async (values) => {
		const p = client.role.update.mutate({
			id: props.role.id,
			name: values.name,
			permissions: props.role.permissions,
		});
		toast.promise(p, {
			loading: { title: c.generic.toasts.loading() },
			success: () => ({ title: c.generic.toasts.success() }),
			error: () => ({ title: c.generic.toasts.error() }),
		});

		props.onUpdated(await p);
		setOpen(false);
	};

	return (
		<Dialog
			openTrigger={props.openTrigger}
			title={`${props.role.name} — ${c.generic.actions.edit()}`}
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
											<Toggle />
										</td>
									</tr>
								)}
							</Index>
						</tbody>
					</table>
				</Collapsible>
				<Button type="submit" disabled={roleForm.invalid || roleForm.submitting}>
					{c.generic.actions.save()}
				</Button>
			</Form>
		</Dialog>
	);
}
