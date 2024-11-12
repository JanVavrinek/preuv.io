import { organizationsContext } from "@contexts/Organizations";
import { WidgetProvider } from "@molecules/App/views/Widget/context/Widget";
import { useNavigate, useParams } from "@solidjs/router";
import { type ParentProps, Suspense, onMount, useContext } from "solid-js";

export default function WidgetDetailView(props: ParentProps) {
	const params = useParams<{ id: string }>();
	const navigate = useNavigate();
	const { activeOrganization } = useContext(organizationsContext);

	onMount(() => {
		if (!activeOrganization()) navigate("/app/dashboard");
	});

	return (
		<WidgetProvider id={params.id}>
			<div class="w-full flex-grow p-4">
				<div class="flex min-h-full w-full flex-col gap-2 rounded-xl border border-pv-blue-200 bg-pv-blue-50 shadow-lg">
					<Suspense>{props.children}</Suspense>
				</div>
			</div>
		</WidgetProvider>
	);
}
