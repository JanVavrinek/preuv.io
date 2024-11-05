import Button from "@atoms/Button";
import Combobox from "@atoms/Combobox";
import type { ComboboxItem } from "@atoms/Combobox/types";
import Pagination from "@atoms/Pagination";
import PermissionsGuard from "@atoms/PermissionsGuard";
import Skeleton from "@atoms/Skeleton";
import useAsync from "@hooks/useAsync";
import { Dialog } from "@kobalte/core/dialog";
import type { ProjectSelectModel } from "@lib/db/schemas/project";
import { RolePermissions } from "@lib/db/schemas/role";
import useI18n from "@lib/i18n/hooks/useI18n";
import { client } from "@lib/trpc/client";
import type { ListCustomer } from "@lib/trpc/routers/customer/types";
import type { Collection } from "@lib/trpc/types";
import AppLayoutTitle from "@molecules/App/AppLayoutTitle";
import EditCustomer from "@molecules/App/views/Customers/EditCustomer";
import { A, useSearchParams } from "@solidjs/router";
import { FaSolidGear, FaSolidPlus } from "solid-icons/fa";
import { FiExternalLink } from "solid-icons/fi";
import { For, Show, batch, createEffect, createMemo, createSignal, on, onMount } from "solid-js";
import { createStore, reconcile } from "solid-js/store";

const LIMIT = 20;

export default function Customers() {
	const { c } = useI18n();
	const [page, setPage] = createSignal(1);
	const [customers, setCustomers] = createStore<Collection<ListCustomer>>({ items: [], total: -1 });
	const { handler, loading } = useAsync(client.customer.getMany.query);
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

	const handleLoadCustomers = () => {
		if (loading() || customers.items.length === customers.total) return;
		const v = projectValue();
		handler({
			limit: LIMIT,
			offset: customers.items.length,
			project: v?.value.length ? v.value : undefined,
		}).then(setCustomers);
	};

	createEffect(on(page, handleLoadCustomers));
	createEffect(
		on(projectValue, () => {
			batch(() => {
				setCustomers("items", []);
				setCustomers("total", -1);
				setPage(1);
			});
			if (page() === 1) handleLoadCustomers();
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
				<AppLayoutTitle>{c.app.customer.list.title()}</AppLayoutTitle>
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
									{c.app.customer.detail.name()}
								</th>
								<th class="border-pv-blue-200 border-b bg-pv-blue-200 p-2 text-start">{c.app.project.edit.name()}</th>
								<th class="border-pv-blue-200 border-b bg-pv-blue-200 p-2 text-start">
									{c.app.customer.detail.testimonialCount()}
								</th>
								<th class="w-9 rounded-tr-xl border-pv-blue-200 border-b bg-pv-blue-200 p-2 text-start" />
							</tr>
						</thead>
						<tbody>
							<For
								each={customers.items}
								fallback={
									<Show when={customers.total === -1}>
										<tr class="group">
											<td class="py-2 pr-2 pl-3 group-even:bg-pv-blue-100 group-last-of-type:rounded-bl-xl">
												<Skeleton height={15} radius={10} />
											</td>
											<td class="py-2 pr-2 pl-3 group-even:bg-pv-blue-100">
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
								{(customer, i) => (
									<tr class="group">
										<td class="py-2 pr-2 pl-3 group-even:bg-pv-blue-100 group-last-of-type:rounded-bl-xl">
											{customer.customer.name}
										</td>
										<td class="py-2 pr-2 pl-3 group-even:bg-pv-blue-100">
											<A
												href={`/app/project/${customer.project.id}`}
												class="flex flex-row items-center gap-2 text-pv-navy-500"
											>
												{customer.project.name}
												<FiExternalLink />
											</A>
										</td>
										<td class="py-2 pr-2 pl-3 group-even:bg-pv-blue-100">{customer.testimonial_count}</td>
										<td class="py-2 pr-2 pl-3 group-even:bg-pv-blue-100 group-last-of-type:rounded-br-xl">
											<EditCustomer
												customer={customer}
												onUpdate={(c) => setCustomers("items", i(), reconcile(c))}
												openTrigger={
													<Dialog.Trigger as={Button} icon={<FaSolidGear />}>
														{c.generic.actions.edit()}
													</Dialog.Trigger>
												}
												onDelete={() =>
													setCustomers("items", (s) => s.filter((c) => c.customer.id !== customer.customer.id))
												}
											/>
										</td>
									</tr>
								)}
							</For>
						</tbody>
					</table>
					<Show when={!customers.items.length && customers.total === 0}>
						<p class="py-4 text-center font-semibold text-pv-blue-500">{c.app.customer.list.noFound()}</p>
					</Show>
					<div class="flex items-center justify-between">
						<PermissionsGuard permissions={[RolePermissions.CUSTOMER_CREATE]}>
							<EditCustomer
								onUpdate={(c) => setCustomers("items", (s) => [...s, c])}
								openTrigger={
									<Dialog.Trigger as={Button} icon={<FaSolidPlus />}>
										{c.generic.actions.create()}
									</Dialog.Trigger>
								}
							/>
						</PermissionsGuard>
						<Pagination count={Math.ceil(customers.total / LIMIT)} page={page()} onPageChange={setPage} />
					</div>
				</div>
			</div>
		</div>
	);
}
