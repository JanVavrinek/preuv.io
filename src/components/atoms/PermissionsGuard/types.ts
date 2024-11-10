import type { RolePermissions } from "@lib/db/schemas/role";
import type { JSX } from "solid-js";

export type PermissionsGuardProps = {
	permissions: RolePermissions[];
	fallback?: JSX.Element;
};
