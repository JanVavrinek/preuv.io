import Dropdown from "@atoms/Dropdown";
import { organizationsContext } from "@contexts/Organizations";
import { Tabs } from "@kobalte/core/tabs";
import useI18n from "@lib/i18n/hooks/useI18n";
import { A, useLocation } from "@solidjs/router";
import { Suspense, createMemo, createSignal, lazy, useContext } from "solid-js";
const CreateOrganization = lazy(() => import("@molecules/App/CreateOrganization"));

const ITEM_CLASS =
	"w-full relative flex flex-row gap-5 p-4 text-pv-blue-700 hover:text-pv-blue-600 hover:bg-pv-navy-200 data-[highlighted]:bg-transparent transition-all duration-150 data-[selected]:text-white hover:rounded-full";
export default function Sidebar() {
	const { c } = useI18n();
	const location = useLocation();
	const [value, setValue] = createSignal(location.pathname ?? "/app/dashboard");
	const { organizations, setOrganizations } = useContext(organizationsContext);
	const [open, setOpen] = createSignal(false);

	const activeOrganization = createMemo(() => {
		return (
			organizations.organizations.find((o) => o.organization.id === organizations.active)?.organization.name ??
			c.app.organization.notSelected()
		);
	});

	return (
		<>
			<Tabs
				as="nav"
				orientation="vertical"
				class="flex h-dvh w-full max-w-72 flex-col gap-4 border border-pv-blue-200 bg-pv-blue-50 py-4 shadow-lg"
				value={value()}
				onChange={setValue}
				defaultValue="/app/dashboard"
			>
				<A href="/app/dashboard" class="text-center text-4xl text-pv-blue-300">
					preuv.io
				</A>
				<Tabs.List class="relative z-0 flex h-full w-full flex-col gap-4 p-5 ">
					<Tabs.Trigger value="/app/dashboard" href="/app/dashboard" as={A} class={ITEM_CLASS}>
						Dashboard
					</Tabs.Trigger>
					<Tabs.Trigger value="/app/settings" href="/app/settings" as={A} class={ITEM_CLASS}>
						Settings
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
			<Suspense>
				<CreateOrganization onOpenChange={setOpen} open={open()} />
			</Suspense>
		</>
	);
}
