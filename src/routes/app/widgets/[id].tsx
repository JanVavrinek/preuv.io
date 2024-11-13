import { organizationsContext } from "@contexts/Organizations";
import useI18n from "@lib/i18n/hooks/useI18n";
import { WidgetProvider } from "@molecules/App/views/Widget/context/Widget";
import { A, useNavigate, useParams } from "@solidjs/router";
import { type ParentProps, Suspense, onMount, useContext } from "solid-js";

export default function WidgetDetailView(props: ParentProps) {
	const params = useParams<{ id: string }>();
	const { c } = useI18n();
	const navigate = useNavigate();
	const { activeOrganization } = useContext(organizationsContext);

	onMount(() => {
		if (!activeOrganization()) navigate("/app/dashboard");
	});

	return (
		<WidgetProvider id={params.id}>
			<div class="w-full flex-grow p-4">
				<div class="flex min-h-full w-full flex-col rounded-xl border border-pv-blue-200 bg-pv-blue-50 shadow-lg">
					<div class="flex flex-row flex-wrap gap-2 border-pv-blue-200 border-b p-5 font-semibold text-pv-blue-600 [&>*]:rounded-3xl [&>*]:p-2 [&>*]:transition-all [&>*]:duration-300 [&_.active]:bg-pv-navy-500 [&_.active]:text-pv-blue-50">
						<A href="general">{c.app.widget.detail.general()}</A>
						<A href="testimonials">{c.app.testimonial.list.title()}</A>
						<A href="design">{c.app.widget.detail.design.title()}</A>
					</div>
					<Suspense>{props.children}</Suspense>
				</div>
			</div>
		</WidgetProvider>
	);
}
