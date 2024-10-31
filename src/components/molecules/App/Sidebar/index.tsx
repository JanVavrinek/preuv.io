import Dropdown from "@atoms/Dropdown";
import { organizationsContext } from "@contexts/Organizations";
import { Button } from "@kobalte/core/button";
import { Tabs } from "@kobalte/core/tabs";
import useI18n from "@lib/i18n/hooks/useI18n";
import { A, useIsRouting, useLocation } from "@solidjs/router";
import { FaSolidXmark } from "solid-icons/fa";
import { Suspense, type VoidProps, createEffect, createMemo, createSignal, lazy, useContext } from "solid-js";
import type { SidebarProps } from "./types";
const CreateOrganization = lazy(() => import("@molecules/App/CreateOrganization"));

const ITEM_CLASS =
	"w-full relative flex flex-row gap-5 p-4 text-pv-blue-700 hover:text-pv-blue-600 hover:bg-pv-navy-200 data-[highlighted]:bg-transparent transition-all duration-150 data-[selected]:text-white hover:rounded-full";
export default function Sidebar(props: VoidProps<SidebarProps>) {
	const { c } = useI18n();
	const location = useLocation();
	const [value, setValue] = createSignal(location.pathname ?? "/app/dashboard");
	const { organizations, setOrganizations } = useContext(organizationsContext);
	const [open, setOpen] = createSignal(false);
	const routing = useIsRouting();

	createEffect(() => {
		if (routing()) {
			props.onOpen(false);
		}
	});

	const activeOrganization = createMemo(() => {
		return (
			organizations.organizations.find((o) => o.organization.id === organizations.active)?.organization.name ??
			c.app.organization.notSelected()
		);
	});

	return (
		<>
			<div
				class="fixed inset-0 z-[1] h-dvh w-dvw cursor-pointer bg-black bg-opacity-20 opacity-100 backdrop-blur-sm transition-[left] duration-150 lg:hidden"
				classList={{
					"-left-full opacity-0": !props.open,
				}}
				onclick={() => props.onOpen(false)}
			/>
			<Tabs
				as="nav"
				orientation="vertical"
				class="fixed z-[1] flex h-dvh w-full max-w-72 flex-col gap-4 border border-pv-blue-200 bg-pv-blue-50 py-4 shadow-lg transition-all duration-500 lg:relative lg:left-0 lg:transition-none"
				value={value()}
				onChange={setValue}
				defaultValue="/app/dashboard"
				classList={{
					"left-0": props.open,
					"-left-full": !props.open,
				}}
			>
				<A href="/app/dashboard" class="text-center text-4xl text-pv-blue-300">
					preuv.io
				</A>
				<Tabs.List class="relative z-0 flex h-full w-full flex-col gap-4 p-5 ">
					<Tabs.Trigger value="/app/dashboard" href="/app/dashboard" as={A} class={ITEM_CLASS}>
						{c.app.dashboard.title()}
					</Tabs.Trigger>
					<Tabs.Trigger value="/app/customers" href="/app/customers" as={A} class={ITEM_CLASS}>
						{c.app.customer.list.title()}
					</Tabs.Trigger>
					<Tabs.Indicator class="-z-10 pointer-events-none absolute top-0 left-0 w-full px-2 transition-all duration-150">
						<div class="h-full w-full rounded-full bg-pv-navy-500" />
					</Tabs.Indicator>
				</Tabs.List>
				<div class="px-5">
					<Dropdown
						items={[
							{
								label: c.app.organization.create(),
								onSelect: () => setOpen(true),
							},
							{
								label: c.app.organization.change(),
								items: organizations.organizations.map((o) => ({
									label: o.organization.name,
									disabled: o.organization.id === organizations.active,
									onSelect: () => setOrganizations("active", o.organization.id),
								})),
								disabled: !organizations.organizations.length,
							},
							...(organizations.active
								? [
										{
											label: c.app.organization.edit.title(),
											href: "/app/organization",
										},
									]
								: []),
						]}
						class="w-full"
					>
						{activeOrganization()}
					</Dropdown>
				</div>
			</Tabs>
			<Button
				class="fixed top-2 right-2 z-10 rounded-full bg-pv-blue-50 bg-opacity-50 p-2 text-3xl text-pv-blue-700 transition-[top] delay-100 duration-300 lg:hidden"
				classList={{
					"!-top-full": !props.open,
				}}
				onclick={() => props.onOpen(false)}
			>
				<FaSolidXmark />
			</Button>
			<Suspense>
				<CreateOrganization onOpenChange={setOpen} open={open()} />
			</Suspense>
		</>
	);
}
