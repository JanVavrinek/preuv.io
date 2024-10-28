import { type ParentProps, Show } from "solid-js";
import useHasPermissions from "./hooks/useHasPermissions";
import type { PermissionsGuardProps } from "./types";

export default function PermissionsGuard(props: ParentProps<PermissionsGuardProps>) {
	const check = useHasPermissions();

	return (
		<Show when={check(props.permissions)} fallback={props.fallback}>
			{props.children}
		</Show>
	);
}
