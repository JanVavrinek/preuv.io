import { Switch } from "@kobalte/core/switch";
import { type VoidProps, splitProps } from "solid-js";
import type { ToggleProps } from "./types";

export default function Toggle(props: VoidProps<ToggleProps>) {
	const [local, input, others] = splitProps(props, ["label"], ["inputProps"]);

	return (
		<Switch {...others} name={input.inputProps?.name}>
			<Switch.Label for={input.inputProps?.name}>{local.label}</Switch.Label>
			<Switch.Input {...input.inputProps} />
			<Switch.Control class="h-8 w-14 cursor-pointer rounded-full border-2 border-pv-blue-200 bg-pv-blue-100 transition-all duration-200 data-[disabled]:cursor-not-allowed data-[checked]:bg-pv-navy-500 data-[disabled]:contrast-50 ">
				<Switch.Thumb class="h-5 w-5 flex-shrink-0 translate-x-1 translate-y-1 rounded-full bg-pv-navy-500 opacity-60 transition-all duration-200 data-[checked]:translate-x-7 data-[checked]:bg-white data-[checked]:opacity-100" />
			</Switch.Control>
		</Switch>
	);
}
