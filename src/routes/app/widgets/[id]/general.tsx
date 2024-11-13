import Button from "@atoms/Button";
import Collapsible from "@atoms/Collapsible";
import Combobox from "@atoms/Combobox";
import type { ComboboxItem } from "@atoms/Combobox/types";
import Input from "@atoms/Input";
import PermissionsGuard from "@atoms/PermissionsGuard";
import { toast } from "@atoms/Toaster";
import useAsync from "@hooks/useAsync";
import { Dialog } from "@kobalte/core/dialog";
import type { ProjectSelectModel } from "@lib/db/schemas/project";
import { RolePermissions } from "@lib/db/schemas/role";
import { widgetSelectModelSchema } from "@lib/db/schemas/widget";
import useI18n from "@lib/i18n/hooks/useI18n";
import { client } from "@lib/trpc/client";
import { createForm, getValue, getValues, setValue, zodForm } from "@modular-forms/solid";
import widgetContext from "@molecules/App/views/Widget/context/Widget";
import ConfirmDelete from "@molecules/common/ConfirmDelete";
import { debounce } from "@solid-primitives/scheduled";
import { useNavigate, useParams } from "@solidjs/router";
import { FaSolidTrash } from "solid-icons/fa";
import { Show, batch, createEffect, onMount, useContext } from "solid-js";
import { createStore } from "solid-js/store";

const schema = widgetSelectModelSchema.pick({
	name: true,
	project_id: true,
});

const LIMIT = 20;

export default function GeneralWidgetSettingsView() {
	const params = useParams<{ id: string | "create" }>();
	const { c } = useI18n();
	const { widget, hasPermission, setWidget } = useContext(widgetContext);
	const [widgetForm, { Field, Form }] = createForm({
		validate: zodForm(schema),
		initialValues: {
			name: widget.widget.name,
			project_id: widget.widget.project_id,
		},
	});
	const [projects, setProjects] = createStore<{ items: ProjectSelectModel[]; total: number }>({
		items: [],
		total: -1,
	});
	const { handler, loading } = useAsync(client.project.getMany.query);
	const { handler: deleteHandler, loading: deleteLoading } = useAsync(client.widget.delete.mutate);
	const navigate = useNavigate();

	const handleLoadProjects = () => {
		if (loading() || projects.items.length === projects.total) return;
		handler({
			limit: LIMIT,
			offset: projects.items.length,
		}).then((res) => {
			batch(() => {
				setProjects("items", res.items);
				setProjects("total", res.total);
			});
		});
	};

	onMount(handleLoadProjects);

	const getProjectValue = (): ComboboxItem | undefined => {
		const v = getValue(widgetForm, "project_id");
		if (!v) return;
		const p = projects.items.find((i) => i.id === v);
		if (!p) return;
		return {
			label: p.name,
			value: p.id,
		};
	};

	const handleDelete = () => {
		if (params.id === "create" || deleteLoading()) return;
		const p = deleteHandler(widget.widget.id);

		toast.promise(p, {
			loading: { title: c.generic.toasts.deleting.loading() },
			success: () => ({ title: c.generic.toasts.deleting.success() }),
			error: () => ({ title: c.generic.toasts.deleting.error() }),
		});

		p.then(() => navigate(`/app/widgets?projectId=${widget.project.id}`));
	};

	const trigger = debounce((values: unknown) => {
		const parse = schema.safeParse(values);
		if (parse.error) return;
		batch(() => {
			setWidget("widget", "name", parse.data.name);
			setWidget("widget", "project_id", parse.data.project_id);
		});
	}, 500);

	createEffect(() => {
		const vals = getValues(widgetForm);
		trigger.clear();
		trigger(vals);
	});

	return (
		<div class="flex flex-col p-5">
			<Collapsible triggerChildren={c.app.widget.detail.general()} defaultOpen>
				<Form>
					<Field name="name">
						{(field, props) => (
							<Input
								inputProps={props}
								value={field.value}
								required
								label={c.app.widget.detail.name()}
								parseResult={schema.shape[field.name].safeParse(field.value)}
								showErrors={!!field.error.length}
								placeholder={c.app.widget.detail.namePlaceholder()}
								readOnly={!hasPermission()}
							/>
						)}
					</Field>
					<Field name="project_id">
						{(field, props) => (
							<>
								<Combobox
									options={projects.items.map<ComboboxItem>((p) => ({
										label: p.name,
										value: p.id,
									}))}
									value={getProjectValue()}
									onChange={(v) => setValue(widgetForm, "project_id", v?.value ?? "")}
									onReachEnd={handleLoadProjects}
									label={c.app.project.edit.name()}
									parseResult={schema.shape[field.name].safeParse(field.value)}
									showErrors={!!field.error.length}
								/>
								<input {...props} hidden />
							</>
						)}
					</Field>
				</Form>
			</Collapsible>
			<Show when={params.id !== "create"}>
				<PermissionsGuard permissions={[RolePermissions.WIDGET_DELETE]}>
					<Collapsible triggerChildren={c.generic.common.dangerZone()}>
						<ConfirmDelete onConfirm={handleDelete}>
							<Dialog.Trigger
								as={Button}
								variant="danger"
								icon={<FaSolidTrash />}
								disabled={deleteLoading()}
								class="mt-2"
							>
								{c.generic.actions.delete()}
							</Dialog.Trigger>
						</ConfirmDelete>
					</Collapsible>
				</PermissionsGuard>
			</Show>
		</div>
	);
}
