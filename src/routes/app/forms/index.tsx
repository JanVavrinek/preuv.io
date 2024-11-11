import Button from "@atoms/Button";
import Combobox from "@atoms/Combobox";
import type { ComboboxItem } from "@atoms/Combobox/types";
import Pagination from "@atoms/Pagination";
import PermissionsGuard from "@atoms/PermissionsGuard";
import { organizationsContext } from "@contexts/Organizations";
import useAsync from "@hooks/useAsync";
import type { ProjectSelectModel } from "@lib/db/schemas/project";
import { RolePermissions } from "@lib/db/schemas/role";
import useI18n from "@lib/i18n/hooks/useI18n";
import { client } from "@lib/trpc/client";
import type { ListForm } from "@lib/trpc/routers/form/types";
import type { Collection } from "@lib/trpc/types";
import AppLayoutTitle from "@molecules/App/AppLayoutTitle";
import Form from "@molecules/App/Form";
import FormSkeleton from "@molecules/App/Form/index.skeleton";
import { A, useNavigate, useSearchParams } from "@solidjs/router";
import { FaSolidPlus } from "solid-icons/fa";
import { For, Show, batch, createEffect, createMemo, createSignal, on, onMount, useContext } from "solid-js";
import { createStore, reconcile } from "solid-js/store";

const LIMIT = 20;

export default function Forms() {
	const { c } = useI18n();
	const [page, setPage] = createSignal(1);
	const [forms, setForms] = createStore<Collection<ListForm>>({ items: [], total: -1 });
	const { handler, loading } = useAsync(client.form.getMany.query);
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

	const handleLoadForms = () => {
		if (loading() || forms.items.length === forms.total) return;
		const v = projectValue();
		handler({
			limit: LIMIT,
			offset: forms.items.length,
			project: v?.value.length ? v.value : undefined,
		}).then(setForms);
	};

	createEffect(on(page, handleLoadForms));
	createEffect(
		on(projectValue, () => {
			batch(() => {
				setForms("items", []);
				setForms("total", -1);
				setPage(1);
			});
			if (page() === 1) handleLoadForms();
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
				<AppLayoutTitle label={Math.max(0, forms.total)}>{c.app.form.list.title()}</AppLayoutTitle>
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
						each={forms.items}
						fallback={
							<Show when={forms.total === -1}>
								<FormSkeleton />
								<FormSkeleton />
							</Show>
						}
					>
						{(form, i) => (
							<Form
								form={form}
								onUpdate={(f) => setForms("items", i(), reconcile(f))}
								onDelete={() => setForms("items", (s) => s.filter((f) => f.form.id !== form.form.id))}
							/>
						)}
					</For>
					<Show when={!forms.items.length && forms.total === 0}>
						<p class="py-4 text-center font-semibold text-pv-blue-500">{c.app.form.list.noFound()}</p>
					</Show>
					<div class="flex items-center justify-between">
						<PermissionsGuard permissions={[RolePermissions.FORM_CREATE]}>
							<Button icon={<FaSolidPlus />} as={A} href="/app/forms/create">
								{c.generic.actions.create()}
							</Button>
						</PermissionsGuard>
						<Pagination count={Math.ceil(forms.total / LIMIT)} page={page()} onPageChange={setPage} />
					</div>
				</div>
			</div>
		</div>
	);
}
