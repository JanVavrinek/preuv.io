import Button from "@atoms/Button";
import type { ProjectSelectModel } from "@lib/db/schemas/project";
import useI18n from "@lib/i18n/hooks/useI18n";
import { client } from "@lib/trpc/client";
import AppLayoutTitle from "@molecules/App/AppLayoutTitle";
import DangerZone from "@molecules/App/views/Project/DangerZone";
import Update from "@molecules/App/views/Project/Update";
import { A, Navigate, type RouteDefinition, useNavigate, useParams } from "@solidjs/router";
import { FaSolidClipboardList, FaSolidUser } from "solid-icons/fa";
import { RiUserUserStarFill } from "solid-icons/ri";
import { ErrorBoundary, Show, createSignal, onMount } from "solid-js";
import { z } from "zod";

export const route = {
	matchFilters: {
		id: (id) => z.string().uuid().safeParse(id).success,
	},
} satisfies RouteDefinition;

function Inner() {
	const { c } = useI18n();
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
							<div class="flex gap-2">
								<Button as={A} href={`/app/customers?projectId=${project()?.id}`} icon={<FaSolidUser />}>
									{c.app.customer.list.title()}
								</Button>
								<Button as={A} href={`/app/testimonials?projectId=${project()?.id}`} icon={<RiUserUserStarFill />}>
									{c.app.testimonial.list.title()}
								</Button>
								<Button as={A} href={`/app/forms?projectId=${project()?.id}`} icon={<FaSolidClipboardList />}>
									{c.app.form.list.title()}
								</Button>
							</div>
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
