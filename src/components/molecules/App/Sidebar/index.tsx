import { Tabs } from "@kobalte/core/tabs";
import { A, useLocation } from "@solidjs/router";
import { createSignal } from "solid-js";

const ITEM_CLASS =
	"w-full relative flex flex-row gap-5 p-4 text-pv-blue-300 hover:text-pv-blue-200 transition-all duration-150 data-[selected]:text-white";
export default function Sidebar() {
	const location = useLocation();
	const [value, setValue] = createSignal(location.pathname ?? "/app/dashboard");
	return (
		<Tabs
			as="nav"
			orientation="vertical"
			class="h-dvh w-full max-w-72"
			value={value()}
			onChange={setValue}
			defaultValue="/app/dashboard"
		>
			<Tabs.List class="relative z-0 flex h-full w-full flex-col gap-4 bg-pv-blue-50 p-5 shadow-lg dark:bg-gray-800 ">
				<Tabs.Trigger
					value="/app/dashboard"
					href="/app/dashboard"
					as={A}
					class={ITEM_CLASS}
				>
					Dashboard
				</Tabs.Trigger>
				<Tabs.Trigger
					value="/app/settings"
					href="/app/settings"
					as={A}
					class={ITEM_CLASS}
				>
					Settings
				</Tabs.Trigger>
				<Tabs.Indicator class="-z-10 pointer-events-none absolute top-0 left-0 w-full px-2 transition-all duration-150">
					<div class="h-full w-full rounded-full bg-pv-navy-500" />
				</Tabs.Indicator>
			</Tabs.List>
		</Tabs>
	);
}
