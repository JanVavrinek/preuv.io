import type { RolePermissions } from "@lib/db/schemas/role";

const permissions: Record<RolePermissions, string> = {
	"member:delete": "Delete member",
	"invite:create": "Invite member",
	"invite:delete": "Delete invite",
	"member:update": "Update member",
	"organization:transfer": "Transfer organization",
	"organization:update": "Update organization",
	"project:create": "Create project",
	"project:delete": "Delete project",
	"project:update": "Update project",
	"role:create": "Create role",
	"role:delete": "Delete role",
	"role:update": "Update role",
};
export default permissions;
