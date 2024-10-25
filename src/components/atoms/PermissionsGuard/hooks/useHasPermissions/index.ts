import { organizationsContext } from "@contexts/Organizations";
import type { RolePermissions } from "@lib/db/schemas/role";
import { useContext } from "solid-js";

export default function useHasPermissions() {
	const { activeOrganization } = useContext(organizationsContext);

	return (permissions: RolePermissions[]) => {
		const org = activeOrganization();
		if (!org) return;
		return org.role.owner ?? permissions.every((p) => org.role.permissions.includes(p));
	};
}
