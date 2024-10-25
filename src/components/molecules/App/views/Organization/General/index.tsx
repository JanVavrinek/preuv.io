import Button from "@atoms/Button";
import Input from "@atoms/Input";
import { toast } from "@atoms/Toaster";
import { organizationsContext } from "@contexts/Organizations";
import { organizationInsertModelSchema } from "@lib/db/schemas/organization";
import useI18n from "@lib/i18n/hooks/useI18n";
import { client } from "@lib/trpc/client";
import { type SubmitHandler, createForm, setValue, zodForm } from "@modular-forms/solid";
import { createEffect, useContext } from "solid-js";
import type { z } from "zod";

const schema = organizationInsertModelSchema.pick({ name: true });
export default function General() {
	const { c } = useI18n();
	const { organizations, activeOrganization, setOrganizations } = useContext(organizationsContext);
	const [organizationForm, { Form, Field }] = createForm({
		validate: zodForm(schema),
		initialValues: {
			name: activeOrganization()?.organization.name,
		},
	});

	createEffect(() =>
		setValue(organizationForm, "name", activeOrganization()?.organization.name ?? "", { shouldDirty: false }),
	);

	const handleSubmit: SubmitHandler<z.infer<typeof schema>> = async (values) => {
		const p = client.organization.update.mutate(values);

		toast.promise(p, {
			loading: { title: c.generic.toasts.saving.loading() },
			success: () => ({ title: c.generic.toasts.saving.success() }),
			error: () => ({ title: c.generic.toasts.saving.error() }),
		});

		const res = await p;
		setOrganizations(
			"organizations",
			organizations.organizations.findIndex((o) => o.organization.id === activeOrganization()?.organization.id),
			"organization",
			res,
		);
	};

	return (
		<Form class="flex flex-col gap-2" onSubmit={handleSubmit}>
			<Field name="name">
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
			<Button
				type="submit"
				disabled={organizationForm.invalid || organizationForm.submitting || !organizationForm.dirty}
			>
				{c.generic.actions.save()}
			</Button>
		</Form>
	);
}
