import Button from "@atoms/Button";
import useI18n from "@lib/i18n/hooks/useI18n";
import Danger from "@molecules/App/views/Form/components/Danger";
import General from "@molecules/App/views/Form/components/General";
import formContext, { FormProvider } from "@molecules/App/views/Form/contexts/Form";
import { type RouteDefinition, useParams } from "@solidjs/router";
import { useContext } from "solid-js";
import { z } from "zod";

export const route = {
	matchFilters: {
		id: (id) => z.string().uuid().safeParse(id).success,
	},
} satisfies RouteDefinition;

function Inner() {
	const { c } = useI18n();
	const { Form } = useContext(formContext);

	return (
		<Form class="flex flex-col gap-2 p-5">
			<General />
			<Danger />
			<Button type="submit"> {c.generic.actions.save()}</Button>
		</Form>
	);
}

export default function FormDetailView() {
	const params = useParams<{ id: string }>();
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
