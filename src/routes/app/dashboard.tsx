import Button from "@atoms/Button";
import { organizationsContext } from "@contexts/Organizations";
import useI18n from "@lib/i18n/hooks/useI18n";
import { client } from "@lib/trpc/client";
import AppLayoutTitle from "@molecules/App/AppLayoutTitle";
import Testimonial from "@molecules/App/Testimonial";
import EmptyDashboard from "@molecules/App/views/Dashboard/EmptyDashboard";
import NoActiveOrganization from "@molecules/App/views/Dashboard/NoActiveOrganization";
import ProjectCard from "@molecules/App/views/Dashboard/ProjectCard";
import { TbReload } from "solid-icons/tb";
import { For, Show, Suspense, createResource, useContext } from "solid-js";
const LIMIT = 3;

export default function DashboardView() {
	const { c } = useI18n();
	const [projects] = createResource(() => client.project.getMany.query({ limit: LIMIT }));
	const [testimonials, { mutate, refetch }] = createResource(() => client.testimonial.getMany.query({ limit: 1 }));
	const { activeOrganization } = useContext(organizationsContext);

	return (
		<>
			<AppLayoutTitle>{c.app.dashboard.title()}</AppLayoutTitle>
			<div class="flex flex-grow flex-col gap-4">
				<Show when={activeOrganization()} fallback={<NoActiveOrganization />}>
					<Suspense fallback="">
						<Show when={testimonials()?.items.length}>
							<div>
								<div class="flex items-center gap-2 pt-4 pl-5 text-pv-blue-400">
									<h2 class=" font-bold text-lg ">{c.app.dashboard.latestTestimonial()}</h2>
									<Button class="h-6 w-6" onclick={refetch}>
										<TbReload />
									</Button>
								</div>

								<div class="flex flex-col gap-2 p-4">
									<For each={testimonials()?.items}>
										{(item) => (
											<Testimonial
												testimonial={item}
												class="bg-pv-blue-50"
												onUpdate={(t) =>
													mutate((s) => {
														return {
															items: (s?.items ?? []).map((i) => (i.testimonial.id === t.testimonial.id ? t : i)),
															total: s?.total ?? -1,
														};
													})
												}
											/>
										)}
									</For>
								</div>
							</div>
						</Show>
						<Show when={projects()?.items.length}>
							<div>
								<h2 class="pl-5 font-bold text-lg text-pv-blue-400">{c.app.project.list.title()}</h2>
								<div class="grid grid-cols-1 gap-2 p-4 md:grid-cols-2 xl:grid-cols-3">
									<For each={projects()?.items}>{(item) => <ProjectCard project={item} />}</For>
								</div>
							</div>
						</Show>
					</Suspense>
				</Show>
				<Show when={!projects.loading && !testimonials.loading}>
					<EmptyDashboard />
				</Show>
			</div>
		</>
	);
}
