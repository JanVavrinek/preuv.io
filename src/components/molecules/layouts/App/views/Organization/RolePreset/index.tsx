import { FaSolidCheck } from "solid-icons/fa";
import { Show, type VoidProps, splitProps } from "solid-js";
import type { RolePresetProps } from "./types";

export default function RolePreset(props: VoidProps<RolePresetProps>) {
	const [local, other] = splitProps(props, ["name", "description", "active"]);

	return (
		<button
			data-active={local.active}
			class="flex flex-col gap-2 rounded-2xl border border-pv-blue-200 bg-pv-blue-50 p-2 text-start text-pv-blue-500 data-[active]:border-2 data-[active]:border-pv-blue-400"
			{...other}
			type="button"
		>
			<div class="flex items-center justify-between">
				<p class="font-bold text-lg">{local.name}</p>
				<div
					class="grid aspect-square h-6 place-items-center rounded-md border border-pv-blue-200 data-[active]:bg-pv-blue-400 data-[active]:text-pv-blue-50"
					data-active={local.active}
				>
					<Show when={local.active}>
						<FaSolidCheck />
					</Show>
				</div>
			</div>
			<p class="text-xs">{local.description}</p>
		</button>
	);
}
