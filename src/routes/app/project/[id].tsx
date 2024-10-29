import type { ProjectSelectModel } from "@lib/db/schemas/project";
import { client } from "@lib/trpc/client";
import AppLayoutTitle from "@molecules/App/AppLayoutTitle";
import DangerZone from "@molecules/App/views/Project/DangerZone";
import Update from "@molecules/App/views/Project/Update";
import { Navigate, useNavigate, useParams } from "@solidjs/router";
import { ErrorBoundary, Show, createSignal, onMount } from "solid-js";

function Inner() {
	const params = useParams<{ id: string }>();
	const navigate = useNavigate();
	const [project, setProject] = createSignal<ProjectSelectModel>();

	onMount(() => {
		client.project.getOne
			.query(params.id)
			.then(setProject)
			.catch(() => navigate("/app/404"));
	});

	return (
		<>
			<Show when={project()} keyed>
				{(p) => (
					<>
						<AppLayoutTitle>{p.name}</AppLayoutTitle>
						<div class="min-h-full w-full rounded-xl border border-pv-blue-200 bg-pv-blue-50 p-5 shadow-lg">
							<Update project={p} onUpdate={setProject} />
							<DangerZone projectId={p.id} />
						</div>
					</>
				)}
			</Show>
		</>
	);
}

export default function ProjectView() {
	return (
		<div class="w-full flex-grow p-4">
			<ErrorBoundary fallback={<Navigate href="/app/404" />}>
				<Inner />
			</ErrorBoundary>
		</div>
	);
}
