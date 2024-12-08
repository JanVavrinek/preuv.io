import Button from "@atoms/Button";
import InterSectionObserver from "@atoms/IntersectionObserver";
import { organizationsContext } from "@contexts/Organizations";
import useAsync from "@hooks/useAsync";
import type { ProjectSelectModel } from "@lib/db/schemas/project";
import useI18n from "@lib/i18n/hooks/useI18n";
import { client } from "@lib/trpc/client";
import AppLayoutTitle from "@molecules/layouts/App/layout/AppLayoutTitle";
import ProjectCard from "@molecules/layouts/App/views/Dashboard/ProjectCard";
import { A, useNavigate } from "@solidjs/router";
import { FaSolidPlus } from "solid-icons/fa";
import { For, Show, batch, onMount, useContext } from "solid-js";
import { createStore } from "solid-js/store";

const LIMIT = 20;

export default function ProjectsView() {
	const { c } = useI18n();
	const [projects, setProjects] = createStore<{ items: ProjectSelectModel[]; total: number }>({ items: [], total: -1 });
	const { handler, loading } = useAsync(client.project.getMany.query);
	const { activeOrganization } = useContext(organizationsContext);
	const navigate = useNavigate();

	const handleLoad = () => {
		if (loading() || projects.total === projects.items.length) return;
		handler({ limit: LIMIT, offset: projects.items.length }).then((res) => {
			batch(() => {
				setProjects("items", (s) => [...s, ...res.items]);
				setProjects("total", res.total);
			});
		});
	};

	onMount(() => {
		if (!activeOrganization()) navigate("/app/dashboard");
	});

	return (
		<>
			<AppLayoutTitle label={Math.max(0, projects.total)}>{c.app.project.list.title()}</AppLayoutTitle>
			<div class="relative flex w-full flex-grow flex-col">
				<Show
					when={!projects.items.length && projects.total === 0}
					fallback={
						<InterSectionObserver onIntersection={handleLoad} class="w-full flex-grow">
							<div class="relative grid grid-cols-1 gap-2 p-4 md:grid-cols-2 xl:grid-cols-3">
								<For each={projects.items}>{(item) => <ProjectCard project={item} />}</For>
							</div>
						</InterSectionObserver>
					}
				>
					<div class="flex-grow">
						<p class="py-4 text-center font-semibold text-pv-blue-500">{c.app.project.list.noFound()}</p>
					</div>
				</Show>
				<div class="sticky bottom-0 border-pv-blue-200 border-t bg-pv-blue-100 bg-opacity-55 p-5 backdrop-blur-md">
					<Button icon={<FaSolidPlus />} as={A} href="/app/project/create" class="w-max">
						{c.generic.actions.create()}
					</Button>
				</div>
			</div>
		</>
	);
}
