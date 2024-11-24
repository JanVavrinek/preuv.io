import { toast } from "@atoms/Toaster";
import { organizationsContext } from "@contexts/Organizations";
import useI18n from "@lib/i18n/hooks/useI18n";
import { client } from "@lib/trpc/client";
import type { ListForm } from "@lib/trpc/routers/form/types";
import Danger from "@molecules/layouts/App/views/Form/components/Danger";
import General from "@molecules/layouts/App/views/Form/components/General";
import formContext, { FormProvider } from "@molecules/layouts/App/views/Form/contexts/Form";
import { type RouteDefinition, useNavigate, useParams } from "@solidjs/router";
import { onMount, useContext } from "solid-js";
import { z } from "zod";
import type { FormSubmitHandler } from "../../../types/forms";

export const route = {
	matchFilters: {
		id: (id) => z.string().uuid().or(z.literal("create")).safeParse(id).success,
	},
} satisfies RouteDefinition;

function Inner() {
	const { c } = useI18n();
	const { Form, formData, setFormData } = useContext(formContext);
	const navigate = useNavigate();

	const handleSubmit: FormSubmitHandler<typeof Form> = async (values) => {
		const id = formData()?.form.id;
		let p: Promise<ListForm>;
		if (id) p = client.form.update.mutate({ id, data: values });
		else p = client.form.create.mutate(values);

		toast.promise(p, {
			loading: { title: c.generic.toasts.saving.loading() },
			success: () => ({ title: c.generic.toasts.saving.success() }),
			error: () => ({ title: c.generic.toasts.saving.error() }),
		});
		const res = await p;
		if (!id) navigate(`/app/forms/${res.form.id}`);
		setFormData(res);
	};

	return (
		<Form class="flex flex-col gap-2 p-5" onSubmit={handleSubmit} onError={(e) => console.log(e)}>
			<General />
			<Danger />
		</Form>
	);
}

export default function FormDetailView() {
	const params = useParams<{ id: string }>();
	const navigate = useNavigate();
	const { activeOrganization } = useContext(organizationsContext);

	onMount(() => {
		if (!activeOrganization()) navigate("/app/dashboard");
	});

	return (
		<FormProvider id={params.id}>
			<div class="w-full flex-grow p-4">
				<div class="flex min-h-full w-full flex-col gap-2 rounded-xl border border-pv-blue-200 bg-pv-blue-50 shadow-lg">
					<Inner />
				</div>
			</div>
		</FormProvider>
	);
}
