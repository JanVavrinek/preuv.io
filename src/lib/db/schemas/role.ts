import * as t from "drizzle-orm/pg-core";
import { enumToPgEnum } from "../utils";
import { organization } from "./organization";

export enum RolePermissions {
	ORGANIZATION_DELETE = "organization:delete",
	ORGANIZATION_UPDATE = "organization:update",
	ORGANIZATION_TRANSFER = "organization:transfer",
	PROJECT_DELETE = "project:delete",
	PROJECT_CREATE = "project:create",
	PROJECT_UPDATE = "project:update",
	MEMBER_INVITE = "member:invite",
	MEMBER_DELETE = "member:delete",
	MEMBER_UPDATE = "member:update",
}

export const rolePermissions = t.pgEnum(
	"permissions",
	enumToPgEnum(RolePermissions),
);

export const role = t.pgTable("roles", {
	id: t.serial().primaryKey(),
	name: t.text().notNull(),
	organization_id: t
		.uuid()
		.references(() => organization.id, { onDelete: "cascade" })
		.notNull(),
	permissions: rolePermissions().array(),
});
