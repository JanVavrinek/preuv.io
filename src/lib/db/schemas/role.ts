import type { InferInsertModel, InferSelectModel } from "drizzle-orm";
import * as t from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { enumToPgEnum } from "../utils";
import { organization } from "./organization";

export enum RolePermissions {
	ORGANIZATION_UPDATE = "organization:update",
	ORGANIZATION_TRANSFER = "organization:transfer",
	//project
	PROJECT_DELETE = "project:delete",
	PROJECT_CREATE = "project:create",
	PROJECT_UPDATE = "project:update",
	//member
	MEMBER_DELETE = "member:delete",
	MEMBER_UPDATE = "member:update",
	//role
	ROLE_CREATE = "role:create",
	ROLE_DELETE = "role:delete",
	ROLE_UPDATE = "role:update",
	//invite
	INVITE_DELETE = "invite:delete",
	INVITE_CREATE = "invite:create",
	//testimonial
	TESTIMONIAL_CREATE = "testimonial:create",
	TESTIMONIAL_DELETE = "testimonial:delete",
	TESTIMONIAL_UPDATE = "testimonial:update",
	//testimonial submitter
	CUSTOMER_CREATE = "submitter:create",
	CUSTOMER_DELETE = "submitter:delete",
	CUSTOMER_UPDATE = "submitter:update",
	//testimonial form
	FORM_CREATE = "form:create",
	FORM_DELETE = "form:delete",
	FORM_UPDATE = "form:update",
}

export const rolePermissions = t.pgEnum("permissions", enumToPgEnum(RolePermissions));

export const role = t.pgTable("roles", {
	id: t.serial().primaryKey(),
	name: t.text().notNull(),
	organization_id: t
		.uuid()
		.references(() => organization.id, { onDelete: "cascade" })
		.notNull(),
	permissions: rolePermissions().array().notNull(),
	owner: t.boolean(),
});

export type RoleSelectModel = InferSelectModel<typeof role>;
export type RoleInsertModel = InferInsertModel<typeof role>;

export const roleSelectModelSchema = createSelectSchema(role).extend({
	permissions: z.nativeEnum(RolePermissions).array(),
	name: z.string().min(3),
});
export const roleInsertModelSchema = createInsertSchema(role).extend({
	name: z.string().min(3),
	permissions: z.nativeEnum(RolePermissions).array(),
});
