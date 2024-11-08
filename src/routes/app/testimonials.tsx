import Button from "@atoms/Button";
import Combobox from "@atoms/Combobox";
import type { ComboboxItem } from "@atoms/Combobox/types";
import Pagination from "@atoms/Pagination";
import PermissionsGuard from "@atoms/PermissionsGuard";
import useAsync from "@hooks/useAsync";
import { Dialog } from "@kobalte/core/dialog";
import type { ProjectSelectModel } from "@lib/db/schemas/project";
import { RolePermissions } from "@lib/db/schemas/role";
import useI18n from "@lib/i18n/hooks/useI18n";
import { client } from "@lib/trpc/client";
import type { ListTestimonial } from "@lib/trpc/routers/testimonial/types";
import type { Collection } from "@lib/trpc/types";
import AppLayoutTitle from "@molecules/App/AppLayoutTitle";
import Testimonial from "@molecules/App/Testimonial";
import TestimonialSkeleton from "@molecules/App/Testimonial/index.skeleton";
import EditTestimonial from "@molecules/App/views/Testimonials/EditTestimonial";
import { useSearchParams } from "@solidjs/router";
import { FaSolidPlus } from "solid-icons/fa";
import { For, Show, batch, createEffect, createMemo, createSignal, on, onMount } from "solid-js";
import { createStore, reconcile } from "solid-js/store";

const LIMIT = 20;

export default function Customers() {
	const { c } = useI18n();
	const [page, setPage] = createSignal(1);
	const [testimonials, setTestimonials] = createStore<Collection<ListTestimonial>>({ items: [], total: -1 });
	const { handler, loading } = useAsync(client.testimonial.getMany.query);
	const { handler: projectHandler, loading: projectLoading } = useAsync(client.project.getMany.query);
	const [params, setParams] = useSearchParams<{ projectId?: string }>();
	const [projectValue, setProjectValue] = createSignal<ComboboxItem | null>({
		value: "",
		label: c.generic.common.all(),
	});

	const [projects, setProjects] = createStore<{ items: ProjectSelectModel[]; total: number }>({
		items: [],
		total: -1,
	});

	const handleLoadProjects = () => {
		if (projectLoading() || projects.items.length === projects.total) return;
		projectHandler({
			limit: LIMIT,
			offset: projects.items.length,
		}).then((res) => {
			batch(() => {
				if (params.projectId && !projectValue()?.value.length) {
					const found = res.items.find((p) => p.id === params.projectId);
					if (found)
						setProjectValue({
							label: found.name,
							value: found.id,
						});
				}
				setProjects("items", res.items);
				setProjects("total", res.total);
			});
			handleLoadProjects();
		});
	};
	onMount(handleLoadProjects);

	const handleLoadTestimonials = () => {
		if (loading() || testimonials.items.length === testimonials.total) return;
		const v = projectValue();
		handler({
			limit: LIMIT,
			offset: testimonials.items.length,
			project: v?.value.length ? v.value : undefined,
		}).then(setTestimonials);
	};

	createEffect(on(page, handleLoadTestimonials));
	createEffect(
		on(projectValue, () => {
			batch(() => {
				setTestimonials("items", []);
				setTestimonials("total", -1);
				setPage(1);
			});
			if (page() === 1) handleLoadTestimonials();
		}),
	);

	const projectsOptions = createMemo(() => {
		return [
			{
				label: c.generic.common.all(),
				value: "",
			},
			...projects.items.map<ComboboxItem>((p) => ({ label: p.name, value: p.id })),
		];
	});

	return (
		<div class="w-full flex-grow p-4">
			<div class="flex min-h-full w-full flex-col gap-2 rounded-xl border border-pv-blue-200 bg-pv-blue-50 shadow-lg">
				<AppLayoutTitle label={Math.max(0, testimonials.total)}>{c.app.testimonial.list.title()}</AppLayoutTitle>
				<div class="w-full border-pv-blue-200 border-b p-2">
					<Combobox
						value={projectValue() ?? undefined}
						onChange={(v) => {
							setProjectValue(v);
							setParams({ projectId: v?.value });
						}}
						options={projectsOptions()}
						label={c.app.project.edit.name()}
						class="max-w-60"
						onReachEnd={handleLoadProjects}
					/>
				</div>
				<div class="flex flex-col gap-2 p-5">
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
								onUpdate={(t) => setTestimonials("items", index(), reconcile(t))}
							/>
						)}
					</For>
					<div class="flex items-center justify-between">
						<PermissionsGuard permissions={[RolePermissions.TESTIMONIAL_CREATE]}>
							<EditTestimonial
								onUpdate={(t) => {
									batch(() => {
										setTestimonials("items", (s) => [...s, t]);
										setTestimonials("total", (s) => s + 1);
									});
								}}
								openTrigger={
									<Dialog.Trigger as={Button} icon={<FaSolidPlus />}>
										{c.generic.actions.create()}
									</Dialog.Trigger>
								}
							/>
						</PermissionsGuard>
						<Pagination count={Math.ceil(testimonials.total / LIMIT)} page={page()} onPageChange={setPage} />
					</div>
				</div>
			</div>
		</div>
	);
}
