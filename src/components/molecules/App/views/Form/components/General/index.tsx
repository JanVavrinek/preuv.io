import Button from "@atoms/Button";
import Collapsible from "@atoms/Collapsible";
import Combobox from "@atoms/Combobox";
import type { ComboboxItem } from "@atoms/Combobox/types";
import Input from "@atoms/Input";
import Toggle from "@atoms/Toggle";
import useAsync from "@hooks/useAsync";
import type { ProjectSelectModel } from "@lib/db/schemas/project";
import useI18n from "@lib/i18n/hooks/useI18n";
import { urlSlugSchema } from "@lib/schemas/url";
import { client } from "@lib/trpc/client";
import { getValue, setValue } from "@modular-forms/solid";
import { debounce } from "@solid-primitives/scheduled";
import { batch, createEffect, createSignal, onMount, useContext } from "solid-js";
import { createStore } from "solid-js/store";
import { z } from "zod";
import formContext, { formEditContextSchema as schema } from "../../contexts/Form";
import Content from "../Content";

const LIMIT = 20;

export default function General() {
	const { c } = useI18n();
	const { Field, hasPermission, form, formData } = useContext(formContext);
	const [slugAvailable, setSlugAvailable] = createSignal<"taken" | "available">("available");
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
	const getProjectValue = (): ComboboxItem | undefined => {
		const v = getValue(form, "project_id");
		if (!v) return;
		const p = projects.items.find((i) => i.id === v);
		if (!p) return;
		return {
			label: p.name,
			value: p.id,
		};
	};

	const trigger = debounce(
		(slug: string) =>
			client.form.slugCheck
				.query({ slug: slug, id: formData()?.form.id })
				.then((res) => setSlugAvailable(res ? "available" : "taken")),
		500,
	);

	createEffect(() => {
		const slug = urlSlugSchema.safeParse(getValue(form, "slug"));
		if (slug.error) return;
		trigger.clear();
		trigger(slug.data);
	});

	onMount(handleLoadProjects);

	return (
		<Collapsible triggerChildren={c.app.form.detail.general()}>
			<Field name="name">
				{(field, props) => (
					<Input
						inputProps={props}
						value={field.value}
						required
						label={c.app.form.detail.name()}
						parseResult={schema.shape[field.name].safeParse(field.value)}
						showErrors={!!field.error.length}
						placeholder={c.app.form.detail.namePlaceholder()}
						readOnly={!hasPermission()}
					/>
				)}
			</Field>
			<Field name="slug">
				{(field, props) => (
					<Input
						inputProps={props}
						value={field.value}
						required
						label={c.app.form.detail.slug()}
						parseResult={z
							.object({
								value: schema.shape[field.name],
								available: z.enum(["available"], { message: "slug-taken" }),
							})
							.safeParse({ value: field.value, available: slugAvailable() })}
						showErrors={field.dirty && form.dirty}
						placeholder={c.app.form.detail.slugPlaceholder()}
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
							onChange={(v) => setValue(form, "project_id", v?.value ?? "")}
							onReachEnd={handleLoadProjects}
							label={c.app.project.edit.name()}
							parseResult={schema.shape[field.name].safeParse(field.value)}
							showErrors={!!field.error.length}
							readOnly={!hasPermission()}
						/>
						<input {...props} hidden />
					</>
				)}
			</Field>
			<Field name="active" type="boolean">
				{(_field, props) => (
					<Toggle
						label={c.app.form.detail.active()}
						disabled={!hasPermission()}
						inputProps={props}
						checked={getValue(form, "active")}
						onChange={(v) => setValue(form, "active", v)}
					/>
				)}
			</Field>
			<Content />
			<Button type="submit" disabled={form.submitting || !form.dirty} class="mt-4 w-full">
				{c.generic.actions.save()}
			</Button>
		</Collapsible>
	);
}
