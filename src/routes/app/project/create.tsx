import Button from "@atoms/Button";
import Input from "@atoms/Input";
import PermissionsGuard from "@atoms/PermissionsGuard";
import { toast } from "@atoms/Toaster";
import { projectInsertModelSchema } from "@lib/db/schemas/project";
import { RolePermissions } from "@lib/db/schemas/role";
import useI18n from "@lib/i18n/hooks/useI18n";
import { client } from "@lib/trpc/client";
import { createForm, zodForm } from "@modular-forms/solid";
import AppLayoutTitle from "@molecules/App/AppLayoutTitle";
import { Navigate, useNavigate } from "@solidjs/router";
import type { FormSubmitHandler } from "../../../types/forms";

const schema = projectInsertModelSchema.pick({ name: true });

export default function ProjectCreate() {
	const { c } = useI18n();
	const navigate = useNavigate();
	const [insertForm, { Form, Field }] = createForm({
		validate: zodForm(schema),
	});

	const handleSubmit: FormSubmitHandler<typeof Form> = async (values) => {
		const p = client.project.create.mutate(values.name);
		toast.promise(p, {
			loading: { title: c.generic.toasts.saving.loading() },
			success: () => ({ title: c.generic.toasts.saving.success() }),
			error: () => ({ title: c.generic.toasts.saving.error() }),
		});
		try {
			const res = await p;
			if (!res) throw new Error("project not returned");
			navigate(`/app/project/${res.id}`);
		} catch {
			navigate("/app/404");
		}
	};
	return (
		<PermissionsGuard permissions={[RolePermissions.PROJECT_CREATE]} fallback={<Navigate href="/app/404" />}>
			<div class="flex h-full w-full justify-center overflow-auto p-4">
				<AppLayoutTitle>{c.app.project.create.title()}</AppLayoutTitle>
				<div class="my-auto w-full max-w-screen-sm rounded-xl border border-pv-blue-200 bg-pv-blue-50 p-5 shadow-lg">
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
								/>
							)}
						</Field>
						<Button type="submit" disabled={insertForm.invalid || insertForm.submitting || !insertForm.dirty}>
							{c.generic.actions.save()}
						</Button>
					</Form>
				</div>
			</div>
		</PermissionsGuard>
	);
}
