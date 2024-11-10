import InterSectionObserver from "@atoms/IntersectionObserver";
import { organizationsContext } from "@contexts/Organizations";
import useAsync from "@hooks/useAsync";
import type { ProjectSelectModel } from "@lib/db/schemas/project";
import useI18n from "@lib/i18n/hooks/useI18n";
import { client } from "@lib/trpc/client";
import AppLayoutTitle from "@molecules/App/AppLayoutTitle";
import NoActiveOrganization from "@molecules/App/views/Dashboard/NoActiveOrganization";
import ProjectCard from "@molecules/App/views/Dashboard/ProjectCard";
import { For, Show, batch, useContext } from "solid-js";
import { createStore } from "solid-js/store";

const LIMIT = 20;

export default function DashboardView() {
	const { c } = useI18n();
	const [projects, setProjects] = createStore<{ items: ProjectSelectModel[]; total: number }>({ items: [], total: -1 });
	const { handler, loading } = useAsync(client.project.getMany.query);
	const { activeOrganization } = useContext(organizationsContext);

	const handleLoad = () => {
		if (loading() || projects.total === projects.items.length) return;
		handler({ limit: LIMIT, offset: projects.items.length }).then((res) => {
			batch(() => {
				setProjects("items", (s) => [...s, ...res.items]);
				setProjects("total", res.total);
			});
		});
	};

	return (
		<>
			<AppLayoutTitle>{c.app.dashboard.title()}</AppLayoutTitle>
			<Show when={activeOrganization()} fallback={<NoActiveOrganization />}>
				<InterSectionObserver onIntersection={handleLoad}>
					<div class="grid grid-cols-1 gap-2 p-4 md:grid-cols-2 xl:grid-cols-3">
						<For each={projects.items}>{(item) => <ProjectCard project={item} />}</For>
					</div>
				</InterSectionObserver>
			</Show>
		</>
	);
}
