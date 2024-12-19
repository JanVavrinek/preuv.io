import Dropdown from "@atoms/Dropdown";
import { organizationsContext } from "@contexts/Organizations";
import { Button } from "@kobalte/core/button";
import useI18n from "@lib/i18n/hooks/useI18n";
import { A, useIsRouting } from "@solidjs/router";
import {
	FaRegularObjectGroup,
	FaSolidClipboardQuestion,
	FaSolidHouse,
	FaSolidUser,
	FaSolidXmark,
} from "solid-icons/fa";
import { Suspense, type VoidProps, createEffect, createMemo, createSignal, lazy, useContext } from "solid-js";
import type { SidebarProps } from "./types";
const CreateOrganization = lazy(() => import("@molecules/layouts/App/layout/CreateOrganization"));
import styles from "./styles.module.css";
import { BiSolidDashboard, BiSolidNote } from "solid-icons/bi";

const ITEM_CLASS =
	"w-full relative flex flex-row items-center gap-2 hover:gap-4 px-4 py-3 text-pv-blue-700 hover:bg-pv-blue-100 data-[highlighted]:bg-transparent transition-all duration-150 data-[selected]:text-white data-[disabled]:pointer-events-none data-[disabled]:opacity-75 rounded-2xl tracking-wide";
export const [openCreateOrganization, setOpenCreateOrganization] = createSignal(false);

export default function Sidebar(props: VoidProps<SidebarProps>) {
	const { c } = useI18n();
	const { organizations, setOrganizations } = useContext(organizationsContext);
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
			<nav
				class="fixed z-[1] flex h-dvh w-full max-w-72 flex-col gap-4 border border-pv-blue-200 bg-pv-blue-50 py-4 shadow-lg transition-all duration-500 lg:relative lg:left-0 lg:transition-none"
				classList={{
					"left-0": props.open,
					"-left-full": !props.open,
				}}
			>
				<A href="/app/dashboard" class="text-center text-4xl text-pv-blue-300">
					preuv.io
				</A>
				<div class="relative z-0 flex h-full w-full flex-col gap-2 p-5 ">
					<A href="/app/dashboard" class={ITEM_CLASS} activeClass={styles.active}>
						<FaSolidHouse />
						{c.app.dashboard.title()}
					</A>
					<A
						href="/app/projects"
						class={ITEM_CLASS}
						aria-disabled={!organizations.active}
						activeClass={styles.active}
						end={false}
					>
						<FaRegularObjectGroup class="text-lg" />
						{c.app.project.list.title()}
					</A>
					<A href="/app/customers" class={ITEM_CLASS} aria-disabled={!organizations.active} activeClass={styles.active}>
						<FaSolidUser />
						{c.app.customer.list.title()}
					</A>
					<A
						href="/app/testimonials"
						class={ITEM_CLASS}
						aria-disabled={!organizations.active}
						activeClass={styles.active}
					>
						<BiSolidNote class="text-lg" />
						{c.app.testimonial.list.title()}
					</A>
					<A href="/app/forms" class={ITEM_CLASS} aria-disabled={!organizations.active} activeClass={styles.active}>
						<FaSolidClipboardQuestion />
						{c.app.form.list.title()}
					</A>
					<A href="/app/widgets" class={ITEM_CLASS} aria-disabled={!organizations.active} activeClass={styles.active}>
						<BiSolidDashboard class="text-lg" />
						{c.app.widget.list.title()}
					</A>
				</div>
				<div class="px-5">
					<Dropdown
						items={[
							{
								label: c.app.organization.create(),
								onSelect: () => setOpenCreateOrganization(true),
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
			</nav>
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
				<CreateOrganization onOpenChange={setOpenCreateOrganization} open={openCreateOrganization()} />
			</Suspense>
		</>
	);
}
