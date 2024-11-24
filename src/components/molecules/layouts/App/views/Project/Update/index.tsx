import Button from "@atoms/Button";
import Collapsible from "@atoms/Collapsible";
import Input from "@atoms/Input";
import PermissionsGuard from "@atoms/PermissionsGuard";
import useHasPermissions from "@atoms/PermissionsGuard/hooks/useHasPermissions";
import { toast } from "@atoms/Toaster";
import { projectInsertModelSchema } from "@lib/db/schemas/project";
import { RolePermissions } from "@lib/db/schemas/role";
import useI18n from "@lib/i18n/hooks/useI18n";
import { client } from "@lib/trpc/client";
import { createForm, zodForm } from "@modular-forms/solid";
import type { VoidProps } from "solid-js";
import type { FormSubmitHandler } from "../../../../../../../types/forms";
import type { UpdateProjectProps } from "./types";

const schema = projectInsertModelSchema.pick({ name: true });

export default function Update(props: VoidProps<UpdateProjectProps>) {
	const { c } = useI18n();
	const check = useHasPermissions();
	const [updateFrom, { Form, Field }] = createForm({
		validate: zodForm(schema),
		initialValues: props.project,
	});

	const handleSubmit: FormSubmitHandler<typeof Form> = async (values) => {
		const p = client.project.update.mutate({ ...values, id: props.project.id });
		toast.promise(p, {
			loading: { title: c.generic.toasts.saving.loading() },
			success: () => ({ title: c.generic.toasts.saving.success() }),
			error: () => ({ title: c.generic.toasts.saving.error() }),
		});
		props.onUpdate(await p);
	};

	return (
		<Collapsible defaultOpen triggerChildren={c.app.project.edit.title()}>
			<Form class="flex flex-col gap-2" onSubmit={handleSubmit}>
				<Field name="name">
					{(field, props) => (
						<Input
							inputProps={props}
							value={field.value}
							required
							label={c.app.project.edit.name()}
							placeholder={c.app.project.edit.placeholder()}
							parseResult={schema.shape[field.name].safeParse(field.value)}
							showErrors={!!field.error.length}
							readOnly={!check([RolePermissions.PROJECT_UPDATE])}
						/>
					)}
				</Field>
				<PermissionsGuard permissions={[RolePermissions.PROJECT_UPDATE]}>
					<Button type="submit" disabled={updateFrom.invalid || updateFrom.submitting || !updateFrom.dirty}>
						{c.generic.actions.save()}
					</Button>
				</PermissionsGuard>
			</Form>
		</Collapsible>
	);
}
