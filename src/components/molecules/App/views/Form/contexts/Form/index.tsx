import useHasPermissions from "@atoms/PermissionsGuard/hooks/useHasPermissions";
import { formSelectModelSchema } from "@lib/db/schemas/form";
import { RolePermissions } from "@lib/db/schemas/role";
import useI18n from "@lib/i18n/hooks/useI18n";
import { client } from "@lib/trpc/client";
import type { ListForm } from "@lib/trpc/routers/form/types";
import { createForm, reset, setValues, zodForm } from "@modular-forms/solid";
import AppLayoutTitle from "@molecules/App/AppLayoutTitle";
import { useNavigate } from "@solidjs/router";
import { type Accessor, type Setter, createSignal, onCleanup } from "solid-js";
import { createMemo } from "solid-js";
import { type ParentProps, createContext, onMount } from "solid-js";
import type { z } from "zod";

export const formEditContextSchema = formSelectModelSchema.omit({
	id: true,
	created_at: true,
});

const [form, { Field, Form }] = createForm<z.infer<typeof formEditContextSchema>>({
	validate: zodForm(formEditContextSchema),
	initialValues: {
		active: false,
		name: "",
		project_id: "",
		slug: "",
		thankyou: "",
		welcome: "",
	},
});

const formContext = createContext<{
	form: typeof form;
	Field: typeof Field;
	Form: typeof Form;
	formData: Accessor<ListForm | undefined>;
	hasPermission: Accessor<boolean>;
	setFormData: Setter<ListForm | undefined>;
}>({
	form,
	Field,
	Form,
	formData: () => undefined,
	hasPermission: () => false,
	setFormData: () => undefined,
});

export function FormProvider(props: ParentProps<{ id: string | "create" }>) {
	const { c } = useI18n();
	const [formData, setFormData] = createSignal<ListForm | undefined>();
	const check = useHasPermissions();

	const navigate = useNavigate();

	onMount(() => {
		if (props.id === "create") return;
		client.form.getOne
			.query(props.id)
			.then((res) => {
				setFormData(res);
				setValues(form, { ...res.form });
			})
			.catch(() => navigate("/app/404"));
	});

	const title = createMemo(() => {
		if (props.id === "create") return c.app.form.create.title();
		const data = formData();
		return data?.form.name.length ? data.form.name : c.generic.actions.edit();
	});

	const hasPermission = createMemo(() => {
		if (props.id === "create" && check([RolePermissions.FORM_CREATE])) return true;
		return check([RolePermissions.FORM_UPDATE]);
	});

	onCleanup(() => {
		reset(form);
	});

	return (
		<formContext.Provider value={{ form, Field, Form, formData, hasPermission, setFormData }}>
			<AppLayoutTitle>{title()}</AppLayoutTitle>
			{props.children}
		</formContext.Provider>
	);
}
export default formContext;
