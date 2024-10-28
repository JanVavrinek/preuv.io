import type { InferInsertModel, InferSelectModel } from "drizzle-orm";
import * as t from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { role } from "./role";
import { user } from "./user";

export const member = t.pgTable(
	"members",
	{
		role_id: t
			.serial()
			.references(() => role.id, { onDelete: "cascade" })
			.notNull(),
		user_id: t
			.uuid()
			.references(() => user.id, { onDelete: "cascade" })
			.notNull(),
		created_at: t.timestamp().defaultNow().notNull(),
	},
	(table) => {
		return {
			pk: t.primaryKey({ columns: [table.role_id, table.user_id] }),
		};
	},
);

export type MemberSelectModel = InferSelectModel<typeof member>;
export type MemberInsertModel = InferInsertModel<typeof member>;

export const memberSelectModelSchema = createSelectSchema(member);
export const memberInsertModelSchema = createInsertSchema(member);
