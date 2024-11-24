import type { Role } from "@contexts/Organizations/types";
import type { JSX } from "solid-js";

export type EditRoleProps = {
	role?: Role;
	onUpdated: (role: Role) => void;
	onDeleted?: () => void;
	openTrigger: JSX.Element;
};
