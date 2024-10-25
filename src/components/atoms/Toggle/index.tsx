import { Switch } from "@kobalte/core/switch";
import { type VoidProps, splitProps } from "solid-js";
import type { ToggleProps } from "./types";

export default function Toggle(props: VoidProps<ToggleProps>) {
	const [local, others] = splitProps(props, ["label"]);

	return (
		<Switch {...others}>
			<Switch.Label>{local.label}</Switch.Label>
			<Switch.Input />
			<Switch.Control class="h-8 w-12 cursor-pointer rounded-full border-2 border-pv-blue-200 bg-pv-blue-100 py-1 transition-all duration-200 data-[disabled]:cursor-not-allowed data-[checked]:bg-pv-navy-500 data-[disabled]:contrast-50">
				<Switch.Thumb class="h-5 w-5 translate-x-1 rounded-full bg-pv-navy-500 opacity-60 transition-all duration-200 data-[checked]:translate-x-full data-[checked]:bg-white data-[checked]:opacity-100" />
			</Switch.Control>
		</Switch>
	);
}