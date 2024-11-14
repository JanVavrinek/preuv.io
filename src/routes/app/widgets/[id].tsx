import Button from "@atoms/Button";
import { toast } from "@atoms/Toaster";
import { organizationsContext } from "@contexts/Organizations";
import useI18n from "@lib/i18n/hooks/useI18n";
import { client } from "@lib/trpc/client";
import type { ListTestimonial } from "@lib/trpc/routers/testimonial/types";
import { widgetCreateMutationInputSchema, widgetUpdateMutationInputSchema } from "@lib/trpc/routers/widget/schemas";
import type { ListWidget } from "@lib/trpc/routers/widget/types";
import widgetContext, { WidgetProvider } from "@molecules/App/views/Widget/context/Widget";
import { A, useMatch, useNavigate, useParams } from "@solidjs/router";
import { FiMenu, FiSave } from "solid-icons/fi";
import { type ParentProps, Show, Suspense, batch, createMemo, createSignal, onMount, useContext } from "solid-js";
import { reconcile } from "solid-js/store";

function Save() {
	const params = useParams<{ id: string | "create" }>();
	const [saving, setSaving] = createSignal(false);
	const { c } = useI18n();
	const { widget, setWidget, testimonials, setTestimonials } = useContext(widgetContext);
	const navigate = useNavigate();

	const disabled = createMemo(() => {
		if (saving()) return false;
		if (params.id === "create") return !widgetCreateMutationInputSchema.safeParse(widget.widget).success;
		return !widgetUpdateMutationInputSchema.shape.data.safeParse(widget.widget).success;
	});

	const handleSave = async () => {
		if (disabled()) return;
		setSaving(true);
		let p: Promise<[ListWidget, ListTestimonial[]]>;
		const testimonialIds = new Set(testimonials().map((t) => t.testimonial.id));

		if (params.id === "create") {
			p = (async () => {
				const w = await client.widget.create.mutate(widget.widget);
				const updatedTestimonials = await client.widget.testimonials.update.mutate({
					id: w.widget.id,
					testimonials: testimonialIds,
				});
				return [w, updatedTestimonials];
			})();
		} else {
			p = (async () => {
				const widgetUpdate = client.widget.update.mutate({ id: widget.widget.id, data: widget.widget });
				const testimonialsUpdate = client.widget.testimonials.update.mutate({
					id: widget.widget.id,
					testimonials: testimonialIds,
				});

				return [await widgetUpdate, await testimonialsUpdate];
			})();
		}

		toast.promise(p, {
			loading: { title: c.generic.toasts.saving.loading() },
			success: () => ({ title: c.generic.toasts.saving.success() }),
			error: () => ({ title: c.generic.toasts.saving.error() }),
		});

		const res = await p;
		if (params.id === "create")
			navigate(`/app/widgets/${res[0].widget.id}/${window.location.pathname.split("/").at(-1)}`);
		else {
			batch(() => {
				setWidget(reconcile(res[0]));
				setTestimonials(res[1]);
			});
		}
	};

	return (
		<Button icon={<FiSave />} disabled={disabled()} onclick={handleSave}>
			{c.generic.actions.save()}
		</Button>
	);
}
function Open() {
	const match = useMatch(() => "/app/widgets/:id/design");
	const { setSidebarOpen } = useContext(widgetContext);

	return (
		<Show when={match()}>
			<button type="button" onclick={() => setSidebarOpen((s) => !s)}>
				<FiMenu font-size="25" />
			</button>
		</Show>
	);
}

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
					<div class="flex flex-row flex-wrap justify-between gap-2 border-pv-blue-200 border-b p-5">
						<div class="flex items-center gap-4 text-pv-blue-600">
							<Open />
							<div class="flex flex-row flex-wrap gap-2 font-semibold text-pv-blue-600 [&>*]:h-max [&>*]:rounded-3xl [&>*]:p-2 [&>*]:transition-all [&>*]:duration-300 [&_.active]:bg-pv-navy-500 [&_.active]:text-pv-blue-50">
								<A href="general">{c.app.widget.detail.general()}</A>
								<A href="testimonials">{c.app.testimonial.list.title()}</A>
								<A href="design">{c.app.widget.detail.design.title()}</A>
							</div>
						</div>
						<Save />
					</div>
					<Suspense>{props.children}</Suspense>
				</div>
			</div>
		</WidgetProvider>
	);
}
