import Button from "@atoms/Button";
import { Dialog } from "@atoms/Dialog";
import Input from "@atoms/Input";
import { toast } from "@atoms/Toaster";
import { organizationsContext } from "@contexts/Organizations";
import useI18n from "@lib/i18n/hooks/useI18n";
import { client } from "@lib/trpc/client";
import { organizationCreateMutationInputSchema as schema } from "@lib/trpc/routers/organization/schemas";
import type { OrganizationCreateMutationInput } from "@lib/trpc/routers/organization/types";
import { type SubmitHandler, createForm, zodForm } from "@modular-forms/solid";
import { type VoidProps, batch, useContext } from "solid-js";
import type { CreateOrganizationProps } from "./types";

export default function CreateOrganization(
	props: VoidProps<CreateOrganizationProps>,
) {
	const { c } = useI18n();
	const [orgForm, { Form, Field }] = createForm({
		validate: zodForm(schema),
	});
	const { setOrganizations } = useContext(organizationsContext);

	const handleSubmit: SubmitHandler<OrganizationCreateMutationInput> = async (
		values,
	) => {
		const p = client.organization.create.mutate(values);
		toast.promise(p, {
			loading: { title: c.generic.toasts.loading() },
			success: () => ({ title: c.generic.toasts.success() }),
			error: () => ({ title: c.generic.toasts.error() }),
		});
		const res = await p;
		batch(() => {
			setOrganizations("active", res.organization.id);
			setOrganizations("organizations", (s) => [...s, res]);
		});
		props.onOpenChange(false);
	};

	return (
		<Dialog
			open={props.open}
			onOpenChange={props.onOpenChange}
			title={c.app.organization.create()}
			description={c.app.organization.createSubtitle()}
		>
			<Form class="flex flex-col gap-2" onSubmit={handleSubmit}>
				<Field name="organizationName">
					{(field, props) => (
						<Input
							inputProps={props}
							value={field.value}
							required
							label={c.app.organization.name()}
							parseResult={schema.shape[field.name].safeParse(field.value)}
							showErrors={!!field.error.length}
							placeholder={c.app.organization.organizationPlaceholder()}
						/>
					)}
				</Field>
				<Field name="ownerRoleName">
					{(field, props) => (
						<Input
							inputProps={props}
							value={field.value}
							required
							label={c.app.organization.roles.name()}
							placeholder={c.app.organization.roles.owner()}
							parseResult={schema.shape[field.name].safeParse(field.value)}
							showErrors={!!field.error.length}
						/>
					)}
				</Field>
				<Button disabled={orgForm.invalid || orgForm.submitting} type="submit">
					{c.generic.actions.save()}
				</Button>
			</Form>
		</Dialog>
	);
}
