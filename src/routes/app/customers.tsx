import Button from "@atoms/Button";
import Pagination from "@atoms/Pagination";
import useAsync from "@hooks/useAsync";
import useI18n from "@lib/i18n/hooks/useI18n";
import { client } from "@lib/trpc/client";
import type { ListCustomer } from "@lib/trpc/routers/customer/types";
import type { Collection } from "@lib/trpc/types";
import AppLayoutTitle from "@molecules/App/AppLayoutTitle";
import { FaSolidGear } from "solid-icons/fa";
import { For, createEffect, createSignal, on } from "solid-js";
import { createStore } from "solid-js/store";

const LIMIT = 20;

export default function Customers() {
	const { c } = useI18n();
	const [page, setPage] = createSignal(1);
	const [customers, setCustomers] = createStore<Collection<ListCustomer>>({ items: [], total: -1 });
	const { handler, loading } = useAsync(client.customer.getMany.query);

	createEffect(
		on(page, () => {
			if (loading() || customers.items.length === customers.total) return;
			handler({ limit: LIMIT, offset: customers.items.length }).then(setCustomers);
		}),
	);

	return (
		<div class="w-full flex-grow p-4">
			<div class="flex min-h-full w-full flex-col gap-2 rounded-xl border border-pv-blue-200 bg-pv-blue-50 p-5 shadow-lg">
				<AppLayoutTitle>{c.app.customer.list.title()}</AppLayoutTitle>

				<table class="w-full border-separate border-spacing-0 rounded-xl border border-pv-blue-200">
					<thead>
						<tr>
							<th class="rounded-tl-xl border-pv-blue-200 border-b bg-pv-blue-200 p-2 text-start">
								{c.app.customer.detail.name()}
							</th>
							<th class="border-pv-blue-200 border-b bg-pv-blue-200 p-2 text-start">
								{c.app.customer.detail.testimonialCount()}
							</th>
							<th class="w-9 rounded-tr-xl border-pv-blue-200 border-b bg-pv-blue-200 p-2 text-start" />
						</tr>
					</thead>
					<tbody>
						<For each={customers.items}>
							{(customer) => (
								<tr class="group">
									<td class="py-2 pr-2 pl-3 group-even:bg-pv-blue-100 group-last-of-type:rounded-bl-xl">
										{customer.customer.name}
									</td>
									<td class="py-2 pr-2 pl-3 group-even:bg-pv-blue-100">{customer.testimonial_count}</td>
									<td class="py-2 pr-2 pl-3 group-even:bg-pv-blue-100 group-last-of-type:rounded-br-xl">
										<Button icon={<FaSolidGear />}>{c.generic.actions.edit()}</Button>
									</td>
								</tr>
							)}
						</For>
					</tbody>
				</table>
				<Pagination count={Math.ceil(customers.total / LIMIT)} page={page()} onPageChange={setPage} />
			</div>
		</div>
	);
}
