import type { InferInsertModel, InferSelectModel } from "drizzle-orm";
import * as t from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { organization } from "./organization";
import { role } from "./role";
import { user } from "./user";

export const invite = t.pgTable(
	"invites",
	{
		role_id: t
			.serial()
			.references(() => role.id, { onDelete: "cascade" })
			.notNull(),
		user_id: t
			.uuid()
			.references(() => user.id, { onDelete: "cascade" })
			.notNull(),
		organization_id: t
			.uuid()
			.references(() => organization.id, { onDelete: "cascade" })
			.notNull(),
	},
	(table) => {
		return {
			pk: t.primaryKey({ columns: [table.role_id, table.user_id, table.organization_id] }),
		};
	},
);

export type InviteSelectModel = InferSelectModel<typeof invite>;
export type InviteInsertModel = InferInsertModel<typeof invite>;

export const inviteSelectModelSchema = createSelectSchema(invite);
export const inviteInsertModelSchema = createInsertSchema(invite);
