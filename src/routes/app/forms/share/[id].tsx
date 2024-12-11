import useI18n from "@lib/i18n/hooks/useI18n";
import AppLayoutTitle from "@molecules/layouts/App/layout/AppLayoutTitle";
import formContext, { FormProvider } from "@molecules/layouts/App/views/Form/contexts/Form";
import { A, type RouteDefinition, useParams } from "@solidjs/router";
import { type ParentProps, Suspense, useContext } from "solid-js";
import { z } from "zod";

export const route = {
	matchFilters: {
		id: (id) => z.string().uuid().safeParse(id).success,
	},
} satisfies RouteDefinition;

function Inner() {
	const { c } = useI18n();

	const { formData } = useContext(formContext);
	return (
		<>
			<AppLayoutTitle>{`${formData()?.form.name} — ${c.generic.actions.share()}`}</AppLayoutTitle>
		</>
	);
}

export default function FormShareView(props: ParentProps) {
	const params = useParams<{ id: string }>();
	const { c } = useI18n();

	return (
		<FormProvider id={params.id}>
			<Inner />
			<div class="w-full flex-grow p-4">
				<div class="flex min-h-full w-full flex-col rounded-xl border border-pv-blue-200 bg-pv-blue-50 shadow-lg">
					<div class="flex flex-row flex-wrap justify-between gap-2 border-pv-blue-200 border-b p-5">
						<div class="flex items-center gap-4 text-pv-blue-600">
							<div class="flex flex-row flex-wrap gap-2 font-semibold text-pv-blue-600 [&>*]:h-max [&>*]:rounded-3xl [&>*]:p-2 [&>*]:transition-all [&>*]:duration-300 [&_.active]:bg-pv-navy-500 [&_.active]:text-pv-blue-50">
								<A href="link">{c.app.formShare.link.title()}</A>
							</div>
						</div>
					</div>
					<Suspense>{props.children}</Suspense>
				</div>
			</div>
		</FormProvider>
	);
}
