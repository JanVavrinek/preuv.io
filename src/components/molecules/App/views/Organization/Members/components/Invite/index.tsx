import Button from "@atoms/Button";
import Combobox from "@atoms/Combobox";
import type { ComboboxItem } from "@atoms/Combobox/types";
import { Dialog } from "@atoms/Dialog";
import Input from "@atoms/Input";
import { toast } from "@atoms/Toaster";
import { organizationsContext } from "@contexts/Organizations";
import type { Role } from "@contexts/Organizations/types";
import useAsync from "@hooks/useAsync";
import { Dialog as KDialog } from "@kobalte/core/dialog";
import useI18n from "@lib/i18n/hooks/useI18n";
import { client } from "@lib/trpc/client";
import { inviteCreateMutationSchema } from "@lib/trpc/routers/invite/schemas";
import {
	createForm,
	getValue,
	getValues,
	insert,
	remove,
	reset,
	setValue,
	toCustom,
	zodForm,
} from "@modular-forms/solid";
import { FaSolidPlus, FaSolidXmark } from "solid-icons/fa";
import { type ComponentProps, For, batch, createEffect, createSignal, on, useContext } from "solid-js";
import { createStore } from "solid-js/store";
import { z } from "zod";
const schema = z.object({
	invites: inviteCreateMutationSchema,
});

const LIMIT = 20;

export default function Invite() {
	const [open, setOpen] = createSignal(false);
	const { c } = useI18n();
	const { activeOrganization } = useContext(organizationsContext);
	const [invitesForm, { Form, FieldArray, Field }] = createForm({
		initialValues: { invites: [{ email: "" }] },
		validate: zodForm(schema),
	});
	const { handler, loading } = useAsync(client.role.getMany.query);
	const [roles, setRoles] = createStore<{ items: Role[]; total: number }>({ items: [], total: -1 });

	const handleSubmit: ComponentProps<typeof Form>["onSubmit"] = (values) => {
		const p = client.organization.invite.create.mutate(values.invites);
		toast.promise(p, {
			loading: { title: c.generic.toasts.saving.loading() },
			success: () => ({ title: c.generic.toasts.saving.success() }),
			error: () => ({ title: c.generic.toasts.saving.error() }),
		});
		reset(invitesForm);
		setOpen(false);
	};
	const handleLoadRoles = () => {
		if (loading() || roles.items.length === roles.total) return;
		handler({
			limit: LIMIT,
			offset: roles.items.length,
		}).then((res) => {
			batch(() => {
				setRoles("items", (s) => [...s, ...res.items]);
				setRoles("total", res.total);
			});
		});
	};

	createEffect(
		on(open, (o) => {
			if (o) {
				batch(() => {
					setRoles("items", []);
					setRoles("total", -1);
				});
				handleLoadRoles();
			}
		}),
	);

	const getComboboxValue = (field: ComponentProps<typeof Field>["name"]): ComboboxItem | undefined => {
		const v = getValue(invitesForm, field);
		if (!v) return;
		return {
			label: String(v),
			value: String(v),
		};
	};

	const handleInsert = () => {
		const lastRole = getValues(invitesForm).invites?.at(-1)?.role ?? -1;
		insert(invitesForm, "invites", {
			value: {
				email: "",
				role: lastRole,
			},
		});
	};

	return (
		<Dialog
			title={`${activeOrganization()?.organization.name} — ${c.app.invite.create()}`}
			openTrigger={<KDialog.Trigger as={Button}>{c.app.invite.create()}</KDialog.Trigger>}
			open={open()}
			onOpenChange={setOpen}
		>
			<Form class="flex flex-col gap-2" onSubmit={handleSubmit}>
				<FieldArray name="invites">
					{(fieldArray) => (
						<div class="flex flex-col">
							<For each={fieldArray.items}>
								{(_, index) => (
									<div class="flex flex-row flex-wrap justify-between gap-2 border-pv-blue-200 border-b p-2 even:bg-pv-blue-100 last-of-type:border-none md:flex-nowrap">
										<Field name={`invites.${index()}.email`}>
											{(field, props) => (
												<Input
													inputProps={props}
													value={field.value}
													required
													label={c.auth.signIn.email()}
													parseResult={schema.shape.invites.element.shape.email.safeParse(field.value)}
													showErrors={!!field.error.length}
													placeholder="jane@doe.com"
												/>
											)}
										</Field>
										<Field
											name={`invites.${index()}.role`}
											transform={toCustom((value) => Number(value), { on: "input" })}
											type="number"
										>
											{(field, props) => (
												<Combobox
													selectProps={props}
													options={roles.items.map<ComboboxItem>((r) => ({
														label: r.name,
														value: String(r.id),
													}))}
													value={getComboboxValue(field.name)}
													onChange={(v) => setValue(invitesForm, field.name, Number(v?.value))}
													onReachEnd={handleLoadRoles}
													label={c.app.organization.roles.name()}
												/>
											)}
										</Field>
										<Button
											variant="danger"
											class="aspect-square self-center"
											onclick={() => remove(invitesForm, "invites", { at: index() })}
										>
											<FaSolidXmark />
										</Button>
									</div>
								)}
							</For>
						</div>
					)}
				</FieldArray>
				<Button onclick={handleInsert} class="w-max" icon={<FaSolidPlus />}>
					{c.app.invite.add()}
				</Button>
				<Button disabled={invitesForm.invalid || invitesForm.submitting} type="submit">
					{c.app.invite.create()}
				</Button>
			</Form>
		</Dialog>
	);
}
