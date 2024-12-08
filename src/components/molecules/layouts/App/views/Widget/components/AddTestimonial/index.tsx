import Button from "@atoms/Button";
import { Dialog } from "@atoms/Dialog";
import Pagination from "@atoms/Pagination";
import PermissionsGuard from "@atoms/PermissionsGuard";
import useAsync from "@hooks/useAsync";
import { Dialog as KDialog } from "@kobalte/core/dialog";
import { RolePermissions } from "@lib/db/schemas/role";
import useI18n from "@lib/i18n/hooks/useI18n";
import { client } from "@lib/trpc/client";
import type { ListTestimonial } from "@lib/trpc/routers/testimonial/types";
import type { Collection } from "@lib/trpc/types";
import ConfirmDelete from "@molecules/common/ConfirmDelete";
import Testimonial from "@molecules/layouts/App/common/Testimonial";
import TestimonialSkeleton from "@molecules/layouts/App/common/Testimonial/index.skeleton";
import EditTestimonial from "@molecules/layouts/App/views/Testimonials/EditTestimonial";
import { FaSolidPlus, FaSolidXmark } from "solid-icons/fa";
import { For, type ParentProps, Show, batch, createEffect, createSignal, on, useContext } from "solid-js";
import { createStore, reconcile } from "solid-js/store";
import widgetContext from "../../context/Widget";
const LIMIT = 20;

export default function AddTestimonial(props: ParentProps) {
	const { c } = useI18n();
	const { testimonials: widgetTestimonials, setTestimonials: setWidgetTestimonials } = useContext(widgetContext);
	const [testimonials, setTestimonials] = createStore<Collection<ListTestimonial>>({ items: [], total: -1 });
	const { handler, loading } = useAsync(client.testimonial.getMany.query);
	const [page, setPage] = createSignal(1);

	const handleLoadTestimonials = () => {
		if (loading() || testimonials.items.length === testimonials.total) return;
		handler({
			limit: LIMIT,
			offset: testimonials.items.length,
		}).then(setTestimonials);
	};

	createEffect(on(page, handleLoadTestimonials));

	return (
		<Dialog openTrigger={props.children} title={c.app.widget.detail.testimonial.add()}>
			<div class="flex flex-col gap-2">
				<For
					each={testimonials.items}
					fallback={
						<Show
							when={!testimonials.items.length && testimonials.total === 0}
							fallback={
								<>
									<TestimonialSkeleton />
									<TestimonialSkeleton />
								</>
							}
						>
							<p class="py-4 text-center font-semibold text-pv-blue-500">{c.app.testimonial.list.noFound()}</p>
						</Show>
					}
				>
					{(testimonial, index) => (
						<Testimonial
							testimonial={testimonial}
							onUpdate={(t) => {
								setTestimonials("items", index(), reconcile(t));
								setWidgetTestimonials((s) => s.map((i) => (i.testimonial.id === t.testimonial.id ? t : i)));
							}}
							actionsSlot={
								<Show
									when={widgetTestimonials().findIndex((t) => t.testimonial.id === testimonial.testimonial.id) !== -1}
									fallback={
										<Button
											variant="success"
											icon={<FaSolidPlus />}
											onclick={() => setWidgetTestimonials((s) => [...s, testimonial])}
										>
											{c.generic.actions.add()}
										</Button>
									}
								>
									<ConfirmDelete
										onConfirm={() =>
											setWidgetTestimonials((s) => s.filter((i) => i.testimonial.id !== testimonial.testimonial.id))
										}
										confirmTitle={c.generic.actions.remove()}
										title={`${c.generic.actions.remove()} ?`}
									>
										<KDialog.Trigger as={Button} variant="danger" icon={<FaSolidXmark />}>
											{c.generic.actions.remove()}
										</KDialog.Trigger>
									</ConfirmDelete>
								</Show>
							}
						/>
					)}
				</For>
				<div class="flex flex-wrap items-center justify-between gap-2">
					<PermissionsGuard permissions={[RolePermissions.TESTIMONIAL_CREATE]}>
						<EditTestimonial
							onUpdate={(t) => {
								batch(() => {
									setTestimonials("items", (s) => [...s, t]);
									setTestimonials("total", (s) => s + 1);
								});
							}}
							openTrigger={
								<KDialog.Trigger as={Button} icon={<FaSolidPlus />}>
									{c.generic.actions.create()}
								</KDialog.Trigger>
							}
						/>
					</PermissionsGuard>
					<Pagination count={Math.ceil(testimonials.total / LIMIT)} page={page()} onPageChange={setPage} />
				</div>
			</div>
		</Dialog>
	);
}
