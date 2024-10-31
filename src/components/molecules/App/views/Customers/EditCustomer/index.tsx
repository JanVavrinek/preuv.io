import Button from "@atoms/Button";
import { Dialog } from "@atoms/Dialog";
import Input from "@atoms/Input";
import PermissionsGuard from "@atoms/PermissionsGuard";
import useHasPermissions from "@atoms/PermissionsGuard/hooks/useHasPermissions";
import { customerInsertModelSchema } from "@lib/db/schemas/customer";
import { RolePermissions } from "@lib/db/schemas/role";
import useI18n from "@lib/i18n/hooks/useI18n";
import { createForm, zodForm } from "@modular-forms/solid";
import type { VoidProps } from "solid-js";
import type { EditCustomerProps } from "./types";

const schema = customerInsertModelSchema.omit({ id: true, created_at: true });

export default function EditCustomer(props: VoidProps<EditCustomerProps>) {
	const { c } = useI18n();
	const check = useHasPermissions();
	const [customerForm, { Field, Form }] = createForm({
		validate: zodForm(schema),
		initialValues: props.customer?.customer,
	});

	return (
		<Dialog
			openTrigger={props.openTrigger}
			title={
				props.customer ? `${props.customer.customer.name} — ${c.generic.actions.edit()}` : c.app.customer.create.title()
			}
		>
			<Form class="flex flex-col gap-2">
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
							readOnly={!check([RolePermissions.CUSTOMER_CREATE])}
						/>
					)}
				</Field>
				<Field name="company">
					{(field, props) => (
						<Input
							inputProps={props}
							value={field.value ?? ""}
							required
							label={c.app.organization.roles.name()}
							parseResult={schema.shape[field.name].safeParse(field.value)}
							showErrors={!!field.error.length}
							placeholder={c.app.organization.roles.owner()}
							readOnly={!check([RolePermissions.CUSTOMER_CREATE])}
						/>
					)}
				</Field>
				<Field name="title">
					{(field, props) => (
						<Input
							inputProps={props}
							value={field.value ?? ""}
							required
							label={c.app.organization.roles.name()}
							parseResult={schema.shape[field.name].safeParse(field.value)}
							showErrors={!!field.error.length}
							placeholder={c.app.organization.roles.owner()}
							readOnly={!check([RolePermissions.CUSTOMER_CREATE])}
						/>
					)}
				</Field>
				<Field name="url">
					{(field, props) => (
						<Input
							inputProps={props}
							value={field.value ?? ""}
							required
							label={c.app.organization.roles.name()}
							parseResult={schema.shape[field.name].safeParse(field.value)}
							showErrors={!!field.error.length}
							placeholder={c.app.organization.roles.owner()}
							readOnly={!check([RolePermissions.CUSTOMER_CREATE])}
						/>
					)}
				</Field>
				<PermissionsGuard permissions={[RolePermissions.ROLE_UPDATE]}>
					<Button type="submit" disabled={customerForm.invalid || customerForm.submitting || !customerForm.dirty}>
						{c.generic.actions.save()}
					</Button>
				</PermissionsGuard>
			</Form>
		</Dialog>
	);
}
