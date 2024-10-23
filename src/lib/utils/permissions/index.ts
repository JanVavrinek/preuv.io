import type { RolePermissions, RoleSelectModel } from "@lib/db/schemas/role";

export function hasPermission(permission: RolePermissions, role?: RoleSelectModel) {
	return (role?.owner || role?.permissions.includes(permission)) ?? false;
}
