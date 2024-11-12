import Button from "@atoms/Button";
import Combobox from "@atoms/Combobox";
import type { ComboboxItem } from "@atoms/Combobox/types";
import Pagination from "@atoms/Pagination";
import Skeleton from "@atoms/Skeleton";
import { organizationsContext } from "@contexts/Organizations";
import useAsync from "@hooks/useAsync";
import type { ProjectSelectModel } from "@lib/db/schemas/project";
import useI18n from "@lib/i18n/hooks/useI18n";
import { client } from "@lib/trpc/client";
import type { ListWidget } from "@lib/trpc/routers/widget/types";
import type { Collection } from "@lib/trpc/types";
import AppLayoutTitle from "@molecules/App/AppLayoutTitle";
import { A, useNavigate, useSearchParams } from "@solidjs/router";
import { FaSolidGear } from "solid-icons/fa";
import { FiExternalLink } from "solid-icons/fi";
import { For, Show, batch, createEffect, createMemo, createSignal, on, onMount, useContext } from "solid-js";
import { createStore } from "solid-js/store";

const LIMIT = 20;

export default function Widgets() {
	const { c } = useI18n();
	const [page, setPage] = createSignal(1);
	const [widgets, setWidgets] = createStore<Collection<ListWidget>>({ items: [], total: -1 });
	const { handler, loading } = useAsync(client.widget.getMany.query);
	const { handler: projectHandler, loading: projectLoading } = useAsync(client.project.getMany.query);
	const [params, setParams] = useSearchParams<{ projectId?: string }>();
	const navigate = useNavigate();
	const { activeOrganization } = useContext(organizationsContext);

	onMount(() => {
		if (!activeOrganization()) navigate("/app/dashboard");
	});

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

	const handleLoadWidgets = () => {
		if (loading() || widgets.items.length === widgets.total) return;
		const v = projectValue();
		handler({
			limit: LIMIT,
			offset: widgets.items.length,
			project: v?.value.length ? v.value : undefined,
		}).then(setWidgets);
	};

	createEffect(on(page, handleLoadWidgets));
	createEffect(
		on(projectValue, () => {
			batch(() => {
				setWidgets("items", []);
				setWidgets("total", -1);
				setPage(1);
			});
			if (page() === 1) handleLoadWidgets();
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
				<AppLayoutTitle label={Math.max(0, widgets.total)}>{c.app.widget.list.title()}</AppLayoutTitle>
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
					<table class="w-full border-separate border-spacing-0 rounded-t-xl border border-pv-blue-200">
						<thead>
							<tr>
								<th class="rounded-tl-xl border-pv-blue-200 border-b bg-pv-blue-200 p-2 text-start">
									{c.app.widget.detail.name()}
								</th>
								<th class="border-pv-blue-200 border-b bg-pv-blue-200 p-2 text-start">{c.app.project.edit.name()}</th>

								<th class="w-9 rounded-tr-xl border-pv-blue-200 border-b bg-pv-blue-200 p-2 text-start" />
							</tr>
						</thead>
						<tbody>
							<For
								each={widgets.items}
								fallback={
									<Show when={widgets.total === -1}>
										<tr class="group">
											<td class="py-2 pr-2 pl-3 group-even:bg-pv-blue-100 group-last-of-type:rounded-bl-xl">
												<Skeleton height={15} radius={10} />
											</td>
											<td class="py-2 pr-2 pl-3 group-even:bg-pv-blue-100">
												<Skeleton height={15} radius={10} />
											</td>

											<td class="py-2 pr-2 pl-3 group-even:bg-pv-blue-100 group-last-of-type:rounded-br-xl">
												<Skeleton radius={9999}>
													<Button icon={<FaSolidGear />}>{c.generic.actions.edit()}</Button>
												</Skeleton>
											</td>
										</tr>
									</Show>
								}
							>
								{(widget) => (
									<tr class="group">
										<td class="py-2 pr-2 pl-3 group-even:bg-pv-blue-100 ">{widget.widget.name}</td>
										<td class="py-2 pr-2 pl-3 group-even:bg-pv-blue-100">
											<A
												href={`/app/project/${widget.project.id}`}
												class="flex flex-row items-center gap-2 text-pv-navy-500"
											>
												{widget.project.name}
												<FiExternalLink />
											</A>
										</td>
										<td class="py-2 pr-2 pl-3 group-even:bg-pv-blue-100 ">
											<Button icon={<FaSolidGear />} as={A} href={`/app/widgets/${widget.widget.id}`}>
												{c.generic.actions.edit()}
											</Button>
										</td>
									</tr>
								)}
							</For>
						</tbody>
					</table>
					<Show when={!widgets.items.length && widgets.total === 0}>
						<p class="py-4 text-center font-semibold text-pv-blue-500">{c.app.widget.list.noFound()}</p>
					</Show>
					<div class="flex items-center justify-between">
						<Pagination count={Math.ceil(widgets.total / LIMIT)} page={page()} onPageChange={setPage} />
					</div>
				</div>
			</div>
		</div>
	);
}
