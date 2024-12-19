import type { JSX } from "solid-js";

export type RolePresetProps = {
	name: string;
	description: string;
	active?: boolean;
} & JSX.HTMLAttributes<HTMLButtonElement>;
