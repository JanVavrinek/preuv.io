import * as t from "drizzle-orm/pg-core";
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
	},
	(table) => {
		return {
			pk: t.primaryKey({ columns: [table.role_id, table.user_id] }),
		};
	},
);
