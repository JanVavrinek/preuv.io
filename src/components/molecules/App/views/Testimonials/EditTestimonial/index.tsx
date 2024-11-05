import Button from "@atoms/Button";
import Collapsible from "@atoms/Collapsible";
import Combobox from "@atoms/Combobox";
import type { ComboboxItem } from "@atoms/Combobox/types";
import { Dialog } from "@atoms/Dialog";
import Input from "@atoms/Input";
import PermissionsGuard from "@atoms/PermissionsGuard";
import useHasPermissions from "@atoms/PermissionsGuard/hooks/useHasPermissions";
import { toast } from "@atoms/Toaster";
import useAsync from "@hooks/useAsync";
import { Dialog as KDialog } from "@kobalte/core/dialog";
import type { ProjectSelectModel } from "@lib/db/schemas/project";
import { RolePermissions } from "@lib/db/schemas/role";
import useI18n from "@lib/i18n/hooks/useI18n";
import { client } from "@lib/trpc/client";
import { testimonialCreateMutationInputSchema as schema } from "@lib/trpc/routers/testimonial/schemas";
import type { ListTestimonial } from "@lib/trpc/routers/testimonial/types";
import { createForm, getValue, reset, setValue, toCustom, zodForm } from "@modular-forms/solid";
import ConfirmDelete from "@molecules/common/ConfirmDelete";
import { FaSolidTrash } from "solid-icons/fa";
import { Show, type VoidProps, batch, createEffect, createSignal, on } from "solid-js";
import { createStore } from "solid-js/store";
import type { FormSubmitHandler } from "../../../../../../types/forms";
import type { EditTestimonialProps } from "./types";

const LIMIT = 20;

export default function EditTestimonial(props: VoidProps<EditTestimonialProps>) {
	const { c } = useI18n();
	const check = useHasPermissions();
	const [open, setOpen] = createSignal(false);
	const [customerForm, { Field, Form }] = createForm({
		validate: zodForm(schema),
		initialValues: props.testimonial?.testimonial,
	});
	const [projects, setProjects] = createStore<{ items: ProjectSelectModel[]; total: number }>({
		items: [],
		total: -1,
	});
	const { handler, loading } = useAsync(client.project.getMany.query);

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

	const handleSubmit: FormSubmitHandler<typeof Form> = async (values) => {
		let p: Promise<ListTestimonial> | undefined = undefined;
		if (props.testimonial) p = client.testimonial.update.mutate({ ...values, id: props.testimonial?.testimonial.id });
		else p = client.testimonial.create.mutate(values);

		toast.promise(p, {
			loading: { title: c.generic.toasts.saving.loading() },
			success: () => ({ title: c.generic.toasts.saving.success() }),
			error: () => ({ title: c.generic.toasts.saving.error() }),
		});

		props.onUpdate(await p);
		setOpen(false);
	};

	const handleDelete = async () => {
		const id = props.testimonial?.customer.id;
		if (!id || !props.onDelete) return;
		const p = client.testimonial.delete.mutate(id);
		toast.promise(p, {
			loading: { title: c.generic.toasts.deleting.loading() },
			success: () => ({ title: c.generic.toasts.deleting.success() }),
			error: () => ({ title: c.generic.toasts.deleting.error() }),
		});
		setOpen(false);
		await p;
		props.onDelete();
	};

	const getProjectValue = (): ComboboxItem | undefined => {
		const v = getValue(customerForm, "project_id");
		if (!v) return;
		const p = projects.items.find((i) => i.id === v);
		if (!p) return;
		return {
			label: p.name,
			value: p.id,
		};
	};
	createEffect(
		on(open, (o) => {
			if (o) handleLoadProjects();
			else reset(customerForm);
		}),
	);

	return (
		<Dialog
			openTrigger={props.openTrigger}
			title={props.testimonial ? c.generic.actions.edit() : c.app.testimonial.create.title()}
			open={open()}
			onOpenChange={setOpen}
		>
			<Form class="flex flex-col gap-2" onSubmit={handleSubmit}>
				<Field name="text">
					{(field, props) => (
						<Input
							inputProps={props}
							value={field.value}
							required
							label="Text"
							parseResult={schema.shape[field.name].safeParse(field.value)}
							showErrors={!!field.error.length}
							readOnly={!check([RolePermissions.CUSTOMER_CREATE])}
						/>
					)}
				</Field>
				<Field
					name="created_at"
					type="Date"
					transform={toCustom((value) => new Date(value?.toISOString() ?? 0), { on: "input" })}
				>
					{(field, props) => (
						<Input
							inputProps={props}
							value={field.value?.toISOString()}
							required
							label="E-mail"
							parseResult={schema.shape[field.name].safeParse(field.value)}
							showErrors={!!field.error.length}
							readOnly={!check([RolePermissions.CUSTOMER_CREATE])}
							type="date"
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
								onChange={(v) => setValue(customerForm, "project_id", v?.value ?? "")}
								onReachEnd={handleLoadProjects}
								label={c.app.project.edit.name()}
								parseResult={schema.shape[field.name].safeParse(field.value)}
								showErrors={!!field.error.length}
							/>
							<input {...props} hidden />
						</>
					)}
				</Field>
				<Show when={props.onDelete && check([RolePermissions.CUSTOMER_DELETE])}>
					<Collapsible triggerChildren={c.generic.common.dangerZone()}>
						<ConfirmDelete onConfirm={handleDelete}>
							<KDialog.Trigger as={Button} variant="danger" icon={<FaSolidTrash />} class="mt-2">
								{c.generic.actions.delete()}
							</KDialog.Trigger>
						</ConfirmDelete>
					</Collapsible>
				</Show>
				<PermissionsGuard permissions={[RolePermissions.ROLE_UPDATE]}>
					<Button type="submit" disabled={customerForm.invalid || customerForm.submitting || !customerForm.dirty}>
						{c.generic.actions.save()}
					</Button>
				</PermissionsGuard>
			</Form>
		</Dialog>
	);
}
