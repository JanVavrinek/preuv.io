import { Progress } from "@kobalte/core/progress";
import { zxcvbn, zxcvbnOptions } from "@zxcvbn-ts/core";
import { type VoidProps, createMemo, onMount } from "solid-js";
import type { PasswordStrengthProps } from "./types";
import { loadOptions } from "./utils";

export default function PasswordStrength(props: VoidProps<PasswordStrengthProps>) {
	onMount(async () => {
		zxcvbnOptions.setOptions(await loadOptions());
	});

	const value = createMemo(() => zxcvbn(props.password).score);

	return (
		<Progress minValue={0} maxValue={4} value={value()} data-value={value()} class="group">
			<Progress.Track class="h-2 w-full overflow-hidden rounded-full border border-pv-blue-200 bg-pv-blue-100">
				<Progress.Fill class="h-full w-[--kb-progress-fill-width] rounded-r-full bg-pv-green-500 transition-all group-data-[value=1]:bg-pv-red-500 group-data-[value=2]:bg-pv-yellow-400" />
			</Progress.Track>
		</Progress>
	);
}
